import { decodeFileId, decodeUniqFileId } from './index';
import Util from './Util';
import FileId from './FileId';
import { UniqFileIdInfo, FileIdInfo } from './types/FileIdInfo';

class FileUniqId {
  public type: number = 0;
  public id?: bigint;
  public volumeId?: bigint;
  public localId?: number | bigint;
  public url?: string;

  static fromFileId(fileId: string) {
    let result = decodeFileId(fileId);
    return FileUniqId.buildFromDecode(result);
  }

  static buildFromDecode(decoded: FileIdInfo | UniqFileIdInfo) {
    let inst = new FileUniqId();
    inst.id = decoded.id;
    inst.volumeId = decoded.volumeId;
    inst.localId = decoded.localId;
    inst.url = decoded.url;
    inst.type = decoded.typeId;
    return inst;
  }

  static fromFileUniqId(fileUniqId: string) {
    let result = decodeUniqFileId(fileUniqId);
    return FileUniqId.buildFromDecode(result);
  }

  static fromFileIdInstance(instance: FileId) {
    let inst = new FileUniqId();
    inst.id = instance.id;
    inst.volumeId = instance.volumeId;
    inst.localId = instance.localId;
    inst.url = instance.url;
    inst.type = instance.typeId;
    return inst;
  }

  toFileUniqId() {
    let out = Util.to32bitBuffer(this.type);
    if (this.type === Util.UNIQUE_WEB && this.url) {
      out += Util.packTLString(Buffer.from(this.url));
    } else if (this.type === Util.UNIQUE_PHOTO && this.volumeId && this.localId) {
      out += Util.to64bitBuffer(this.volumeId);
      out += Util.to32bitSignedBuffer(this.localId as number);
    } else if (this.id) {
      out += Util.to64bitBuffer(this.id);
    }

    return Util.base64UrlEncode(Util.rleEncode(out));
  }
}

export default FileUniqId;
