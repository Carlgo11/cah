import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import { ToastService } from '@service/toast.service';
import { Toast } from '@class/toast';
import { Socket } from 'ngx-socket-io';
import { TokenService } from '@service/token.service';
import { GameRequest } from '@class/game-request';

@Component({
  selector: 'app-in-game-settings',
  templateUrl: './in-game-settings.component.html',
  styleUrls: ['./in-game-settings.component.scss']
})
export class InGameSettingsComponent {

  @Input() game: ISocket.GameState.State;
  @Output() close = new EventEmitter(true);

  hidePassword = true;
  pid: string;
  created: string;

  constructor(
    private _clipboardService: ClipboardService,
    private _toastService: ToastService,
    private _socket: Socket,
    private _tokenService: TokenService
    ) {
      this.pid = this._tokenService.get();
    }

  formatCreationDateTime() {
    const d = new Date(this.game.created);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
  }

  formatTime() {

    if (this.game.settings.timeout === 0) {
      return 'Unlimited';
    } else if (this.game.settings.timeout < 61) {
      return '60 seconds';
    } else {
      return `${Math.floor(this.game.settings.timeout / 60)} minutes, ${this.game.settings.timeout % 60} seconds`;
    }

  }

  copyUrl() {
    const url = `${origin.toString()}/join/${this.game.gid}`;
    if (this._clipboardService.copyFromContent(url)) {
      this._toastService.emit(new Toast('URL copied to clipboard.'));
    } else {
      this._toastService.emit(new Toast('Failed to copy URL to clipboard.'));
    }
  }

  closeSettings() {
    this.close.emit();
  }

  restart() {
    const gr = new GameRequest(this._tokenService.get(), this.game.gid);
    this._socket.emit('restart-game', gr);
    this.close.emit();
    this._toastService.emit(new Toast('Game restarted.'));
  }

}
