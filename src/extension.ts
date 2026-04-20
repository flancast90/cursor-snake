import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

const HIGH_SCORES_KEY = 'cursorSnake.highScores.v1';
const SETTINGS_KEY = 'cursorSnake.settings.v1';

type HighScores = Record<string, number>;

export function activate(context: vscode.ExtensionContext) {
  const open = (options?: { dailyChallenge?: boolean }) => {
    SnakePanel.createOrShow(context, options);
  };

  context.subscriptions.push(
    vscode.commands.registerCommand('cursor-snake.start', () => open()),
    vscode.commands.registerCommand('cursor-snake.dailyChallenge', () =>
      open({ dailyChallenge: true }),
    ),
    vscode.commands.registerCommand('cursor-snake.resetHighScores', async () => {
      await context.globalState.update(HIGH_SCORES_KEY, {});
      vscode.window.showInformationMessage('Snake high scores cleared.');
      SnakePanel.current?.postMessage({ type: 'highScores', scores: {} });
    }),
  );
}

export function deactivate() {}

class SnakePanel {
  public static current: SnakePanel | undefined;
  private static readonly viewType = 'cursorSnake';

  private readonly panel: vscode.WebviewPanel;
  private readonly context: vscode.ExtensionContext;
  private disposables: vscode.Disposable[] = [];

  public static createOrShow(
    context: vscode.ExtensionContext,
    options?: { dailyChallenge?: boolean },
  ) {
    const column = vscode.window.activeTextEditor?.viewColumn ?? vscode.ViewColumn.One;

    if (SnakePanel.current) {
      SnakePanel.current.panel.reveal(column);
      if (options?.dailyChallenge) {
        SnakePanel.current.postMessage({ type: 'startDailyChallenge' });
      }
      return;
    }

    const mediaRoot = vscode.Uri.file(path.join(context.extensionPath, 'media'));
    const panel = vscode.window.createWebviewPanel(
      SnakePanel.viewType,
      'Snake',
      column,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [mediaRoot],
      },
    );

    SnakePanel.current = new SnakePanel(panel, context);

    if (options?.dailyChallenge) {
      SnakePanel.current.postMessage({ type: 'startDailyChallenge' });
    }
  }

  private constructor(panel: vscode.WebviewPanel, context: vscode.ExtensionContext) {
    this.panel = panel;
    this.context = context;

    this.panel.webview.html = this.buildHtml();
    this.panel.iconPath = this.buildIconUri();

    this.panel.onDidDispose(() => this.dispose(), null, this.disposables);
    this.panel.webview.onDidReceiveMessage(
      (msg) => this.onMessage(msg),
      null,
      this.disposables,
    );

    this.postMessage({
      type: 'hydrate',
      highScores: this.getHighScores(),
      settings: this.context.globalState.get(SETTINGS_KEY, null),
    });
  }

  public postMessage(message: unknown) {
    void this.panel.webview.postMessage(message);
  }

  private onMessage(msg: any) {
    if (!msg || typeof msg !== 'object') return;
    switch (msg.type) {
      case 'submitScore': {
        const key: string = String(msg.key ?? 'classic');
        const score: number = Math.max(0, Math.floor(Number(msg.score) || 0));
        const scores = this.getHighScores();
        if (!scores[key] || score > scores[key]) {
          scores[key] = score;
          void this.context.globalState.update(HIGH_SCORES_KEY, scores);
          this.postMessage({ type: 'highScores', scores });
        }
        return;
      }
      case 'saveSettings': {
        void this.context.globalState.update(SETTINGS_KEY, msg.settings ?? null);
        return;
      }
      case 'requestHighScores': {
        this.postMessage({ type: 'highScores', scores: this.getHighScores() });
        return;
      }
      case 'resetHighScores': {
        void this.context.globalState.update(HIGH_SCORES_KEY, {});
        this.postMessage({ type: 'highScores', scores: {} });
        return;
      }
      case 'toast': {
        vscode.window.showInformationMessage(String(msg.message ?? ''));
        return;
      }
    }
  }

  private getHighScores(): HighScores {
    return this.context.globalState.get<HighScores>(HIGH_SCORES_KEY, {}) ?? {};
  }

  private buildIconUri() {
    const file = vscode.Uri.file(path.join(this.context.extensionPath, 'media', 'icon.svg'));
    return { light: file, dark: file };
  }

  private buildHtml(): string {
    const webview = this.panel.webview;
    const mediaPath = path.join(this.context.extensionPath, 'media');
    const htmlPath = path.join(mediaPath, 'index.html');

    const scriptUri = webview.asWebviewUri(vscode.Uri.file(path.join(mediaPath, 'snake.js')));
    const styleUri = webview.asWebviewUri(vscode.Uri.file(path.join(mediaPath, 'snake.css')));
    const nonce = makeNonce();

    let html = fs.readFileSync(htmlPath, 'utf8');
    const csp =
      `default-src 'none'; ` +
      `img-src ${webview.cspSource} data: blob:; ` +
      `style-src ${webview.cspSource} 'unsafe-inline'; ` +
      `script-src 'nonce-${nonce}'; ` +
      `font-src ${webview.cspSource};`;

    html = html
      .replace(/{{cspSource}}/g, webview.cspSource)
      .replace(/{{csp}}/g, csp)
      .replace(/{{nonce}}/g, nonce)
      .replace(/{{scriptUri}}/g, scriptUri.toString())
      .replace(/{{styleUri}}/g, styleUri.toString());

    return html;
  }

  public dispose() {
    SnakePanel.current = undefined;
    this.panel.dispose();
    while (this.disposables.length) {
      const d = this.disposables.pop();
      d?.dispose();
    }
  }
}

function makeNonce(): string {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
