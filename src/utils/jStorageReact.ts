class JStorageReact {
  version: string;
  storage: Storage | null;
  jStorage: { [key: string]: any };
  jStorageMeta: {
    CRC32: { [key: string]: number };
    TTL: { [key: string]: number };
    PubSub?: any[];
  };
  crc32Table: number[];
  batchChanges: boolean;
  listeners: { [key: string]: Function[] };
  subscriptions: { [key: string]: Function[] };

  constructor() {
    this.version = "1.0.0";
    this.storage = this.isBrowser() ? window.localStorage : null;
    this.jStorage = this.storage
      ? JSON.parse(this.storage.getItem("jStorage") || "{}")
      : {};
    this.jStorageMeta = this.jStorage.__jstorage_meta || { CRC32: {}, TTL: {} };
    this.crc32Table = [];
    this.batchChanges = false;
    this.listeners = {};
    this.subscriptions = {};
    this.init();
  }

  isBrowser() {
    return typeof window !== "undefined";
  }

  init() {
    if (this.storage) {
      if (!this.jStorage.__jstorage_meta) {
        this.jStorage.__jstorage_meta = { CRC32: {}, TTL: {} };
      }
      if (!this.jStorage.__jstorage_meta.CRC32) {
        this.jStorage.__jstorage_meta.CRC32 = {};
      }
      if (!this.jStorage.__jstorage_meta.TTL) {
        this.jStorage.__jstorage_meta.TTL = {};
      }
      this.save();
      this.cleanupTTL();
    }
  }

  save() {
    if (this.storage) {
      this.storage.setItem("jStorage", JSON.stringify(this.jStorage));
    }
  }

  startBatch() {
    this.batchChanges = true;
  }

  endBatch() {
    this.batchChanges = false;
    this.save();
  }

  set(key: string, value: any, options: { TTL?: number } = {}) {
    if (!this.storage) return;

    if (typeof value === "undefined") {
      this.deleteKey(key);
      return;
    }

    if (typeof value === "function") {
      return;
    }

    if (this.isXML(value)) {
      value = { _is_xml: true, xml: this.encodeXML(value) };
    } else if (typeof value === "object") {
      value = JSON.parse(JSON.stringify(value));
    }

    this.jStorage[key] = value;
    this.jStorageMeta.CRC32[key] = this.crc32(JSON.stringify(value));
    this.setTTL(key, options.TTL || 0);

    if (!this.batchChanges) {
      this.save();
    }

    this.notifyListeners(key, "updated");
  }

  get(key: string, defaultValue: any = null) {
    if (!this.storage) return defaultValue;

    if (this.jStorage[key] && this.jStorage[key]._is_xml) {
      return this.decodeXML(this.jStorage[key].xml);
    }
    return this.jStorage[key] || defaultValue;
  }

  deleteKey(key: string) {
    if (!this.storage) return;

    delete this.jStorage[key];
    delete this.jStorageMeta.TTL[key];
    delete this.jStorageMeta.CRC32[key];

    if (!this.batchChanges) {
      this.save();
    }

    this.notifyListeners(key, "deleted");
  }

  setTTL(key: string, ttl: number) {
    if (!this.storage) return;

    if (!ttl) {
      delete this.jStorageMeta.TTL[key];
    } else {
      this.jStorageMeta.TTL[key] = Date.now() + ttl;
    }
    this.cleanupTTL();

    if (!this.batchChanges) {
      this.save();
    }
  }

  getTTL(key: string) {
    if (!this.storage) return 0;

    return this.jStorageMeta.TTL[key] - Date.now();
  }

  cleanupTTL() {
    if (!this.storage) return;

    const now = Date.now();
    for (const key in this.jStorageMeta.TTL) {
      if (this.jStorageMeta.TTL[key] <= now) {
        this.deleteKey(key);
      }
    }
  }

  isXML(value: any) {
    return value && value.nodeType;
  }

  encodeXML(xml: any) {
    if (typeof XMLSerializer !== "undefined") {
      return new XMLSerializer().serializeToString(xml);
    }
    return xml.xml || "";
  }

  decodeXML(xmlStr: string) {
    const parser = new DOMParser();
    return parser.parseFromString(xmlStr, "text/xml");
  }

  crc32(str: string) {
    let crc = 0,
      i,
      j;
    const table =
      this.crc32Table || (this.crc32Table = this.generateCRC32Table());

    crc = crc ^ -1;
    for (i = 0; i < str.length; i++) {
      j = (crc ^ str.charCodeAt(i)) & 0xff;
      crc = (crc >>> 8) ^ table[j];
    }

    return (crc ^ -1) >>> 0;
  }

  generateCRC32Table() {
    let c;
    const table = [];
    for (let n = 0; n < 256; n++) {
      c = n;
      for (let k = 0; k < 8; k++) {
        if (c & 1) {
          c = 0xedb88320 ^ (c >>> 1);
        } else {
          c = c >>> 1;
        }
      }
      table[n] = c;
    }
    return table;
  }

  storageSize() {
    if (!this.storage) return 0;

    return new Blob([JSON.stringify(this.jStorage)]).size;
  }

  storageAvailable() {
    return !!this.storage;
  }

  flush() {
    if (!this.storage) return;

    this.jStorage = { __jstorage_meta: { CRC32: {}, TTL: {} } };
    this.save();
    this.notifyListeners(null, "flushed");
  }

  storageObj() {
    return JSON.parse(JSON.stringify(this.jStorage));
  }

  index() {
    return Object.keys(this.jStorage).filter(
      (key) => key !== "__jstorage_meta",
    );
  }

  currentBackend() {
    return this.storage ? "localStorage" : null;
  }

  listenKeyChange(key: string, callback: Function) {
    if (!this.listeners[key]) {
      this.listeners[key] = [];
    }
    this.listeners[key].push(callback);
  }

  stopListening(key: string, callback: Function) {
    if (this.listeners[key]) {
      this.listeners[key] = this.listeners[key].filter((cb) => cb !== callback);
    }
  }

  subscribe(channel: string, callback: Function) {
    if (!this.subscriptions[channel]) {
      this.subscriptions[channel] = [];
    }
    this.subscriptions[channel].push(callback);
  }

  publish(channel: string, payload: any) {
    if (!this.jStorageMeta.PubSub) {
      this.jStorageMeta.PubSub = [];
    }
    this.jStorageMeta.PubSub.push([Date.now(), channel, payload]);
    this.save();
    this.notifySubscribers(channel, payload);
  }

  reInit() {
    this.jStorage = this.storage
      ? JSON.parse(this.storage.getItem("jStorage") || "{}")
      : {};
    this.jStorageMeta = this.jStorage.__jstorage_meta || { CRC32: {}, TTL: {} };
  }

  notifyListeners(key: string | null, action: string) {
    if (key === null) {
      Object.keys(this.listeners).forEach((k) => {
        this.listeners[k].forEach((callback) => callback(k, action));
      });
    } else if (this.listeners[key]) {
      this.listeners[key].forEach((callback) => callback(key, action));
    }
  }

  notifySubscribers(channel: string, payload: any) {
    if (this.subscriptions[channel]) {
      this.subscriptions[channel].forEach((callback) =>
        callback(channel, payload),
      );
    }
  }
}

const jStorageReact = new JStorageReact();

export default jStorageReact;
