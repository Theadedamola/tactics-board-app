import { Peer, DataConnection } from 'peerjs';
import { SyncMessage } from '../types/tactics';

export type MessageHandler = (message: SyncMessage) => void;
export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export class TacticsSyncService {
  private peer: Peer | null = null;
  private connection: DataConnection | null = null;
  private broadcastChannel: BroadcastChannel | null = null;
  private messageHandlers: Set<MessageHandler> = new Set();
  private statusHandlers: Set<(status: ConnectionStatus) => void> = new Set();
  public status: ConnectionStatus = 'disconnected';
  public roomId: string = '';
  public isHost: boolean = false;

  constructor() {}

  public init(roomId: string, isHost: boolean) {
    this.roomId = roomId;
    this.isHost = isHost;
    this.updateStatus('connecting');

    // 1. Setup local BroadcastChannel (cross-tab / offline instant sync)
    try {
      this.broadcastChannel = new BroadcastChannel(`mnf_tactics_${roomId}`);
      this.broadcastChannel.onmessage = (event) => {
        if (event.data) {
          this.notifyHandlers(event.data);
        }
      };
    } catch (e) {
      console.warn('BroadcastChannel not supported', e);
    }

    // 2. Setup WebRTC via PeerJS
    this.initPeer();
  }

  private initPeer() {
    // Generate deterministic host ID from room number
    const hostPeerId = `mnf-tv-${this.roomId.toLowerCase()}`;
    const peerId = this.isHost ? hostPeerId : undefined;

    try {
      this.peer = new Peer(peerId as any, {
        debug: 1,
      });

      this.peer.on('open', (id) => {
        console.log(`[PeerSync] Peer opened with ID: ${id}`);
        if (this.isHost) {
          this.updateStatus('connected');
        } else {
          // Connect to Host
          this.connectToHost(hostPeerId);
        }
      });

      this.peer.on('connection', (conn) => {
        console.log(`[PeerSync] Incoming connection from: ${conn.peer}`);
        this.setupConnection(conn);
      });

      this.peer.on('error', (err) => {
        console.warn('[PeerSync] Peer error:', err.type, err);
        // Fallback gracefully to BroadcastChannel
        if (this.broadcastChannel) {
          this.updateStatus('connected');
        } else {
          this.updateStatus('error');
        }
      });
    } catch (err) {
      console.error('[PeerSync] Failed to initialize peer:', err);
    }
  }

  private connectToHost(hostId: string) {
    if (!this.peer) return;
    const conn = this.peer.connect(hostId, {
      reliable: true,
    });
    this.setupConnection(conn);
  }

  private setupConnection(conn: DataConnection) {
    this.connection = conn;

    conn.on('open', () => {
      console.log('[PeerSync] WebRTC Connection established!');
      this.updateStatus('connected');
    });

    conn.on('data', (data: any) => {
      this.notifyHandlers(data as SyncMessage);
    });

    conn.on('close', () => {
      console.log('[PeerSync] Connection closed');
      this.updateStatus('disconnected');
    });

    conn.on('error', (err) => {
      console.warn('[PeerSync] Conn error:', err);
    });
  }

  public sendMessage(message: SyncMessage) {
    // Send via BroadcastChannel (local tabs)
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage(message);
      } catch (e) {
        console.warn('BroadcastChannel send error:', e);
      }
    }

    // Send via WebRTC DataChannel (remote phone to TV)
    if (this.connection && this.connection.open) {
      try {
        this.connection.send(message);
      } catch (e) {
        console.warn('WebRTC send error:', e);
      }
    }
  }

  public onMessage(handler: MessageHandler) {
    this.messageHandlers.add(handler);
    return () => this.messageHandlers.delete(handler);
  }

  public onStatusChange(handler: (status: ConnectionStatus) => void) {
    this.statusHandlers.add(handler);
    handler(this.status);
    return () => this.statusHandlers.delete(handler);
  }

  private notifyHandlers(message: SyncMessage) {
    this.messageHandlers.forEach((handler) => handler(message));
  }

  private updateStatus(status: ConnectionStatus) {
    this.status = status;
    this.statusHandlers.forEach((handler) => handler(status));
  }

  public destroy() {
    if (this.connection) {
      this.connection.close();
      this.connection = null;
    }
    if (this.peer) {
      this.peer.destroy();
      this.peer = null;
    }
    if (this.broadcastChannel) {
      this.broadcastChannel.close();
      this.broadcastChannel = null;
    }
    this.messageHandlers.clear();
    this.statusHandlers.clear();
  }
}

export const syncService = new TacticsSyncService();
