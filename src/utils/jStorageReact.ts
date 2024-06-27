type XMLData = {
  _is_xml: boolean;
  xml: string;
};

interface MetaData {
  CRC32: Record<string, string>;
  TTL?: Record<string, number>;
  PubSub?: Array<[number, string, any]>;
}

interface StorageObject {
  __jstorage_meta: MetaData;
  [key: string]: any;
}

const jStorageReact = (() => {
  let c: StorageObject = { __jstorage_meta: { CRC32: {} } };

  const n = {
    parse: (data: string) => JSON.parse(data),
    stringify: (data: any) => JSON.stringify(data),
  };

  const E = {
    isXML: (a: any) =>
      a && (a.ownerDocument || a).documentElement
        ? "HTML" !== (a.ownerDocument || a).documentElement.nodeName
        : false,
    encode: (a: any) => new XMLSerializer().serializeToString(a),
    decode: (a: string) => new DOMParser().parseFromString(a, "text/xml"),
  };

  const localStorageAvailable = (() => {
    try {
      window.localStorage.setItem("_tmptest", "tmpval");
      window.localStorage.removeItem("_tmptest");
      return true;
    } catch (e) {
      return false;
    }
  })();

  const l = localStorageAvailable ? window.localStorage : ({} as Storage);
  const m = localStorageAvailable ? "localStorage" : "none";

  const r = (a: string | number) => {
    if (!a || (typeof a !== "string" && typeof a !== "number"))
      throw new TypeError("Key name must be string or numeric");
    if (a === "__jstorage_meta") throw new TypeError("Reserved key name");
    return true;
  };

  const w = () => {
    if (m === "localStorage") {
      l.setItem("jStorage", n.stringify(c));
    }
  };

  const x = () => {
    if (m === "localStorage") {
      l.setItem("jStorage", n.stringify(c));
    }
  };

  const B = () => {};

  if (localStorageAvailable) {
    try {
      c = n.parse(l.getItem("jStorage") || "{}");
    } catch (e) {
      l.setItem("jStorage", "{}");
    }
  }

  const set = (key: string, value: any, options: { TTL?: number } = {}) => {
    r(key);
    if (typeof value === "undefined") {
      return deleteKey(key);
    }
    if (E.isXML(value)) {
      value = { _is_xml: true, xml: E.encode(value) };
    } else if (typeof value === "function") {
      return;
    } else if (value && typeof value === "object") {
      value = n.parse(n.stringify(value));
    }
    c[key] = value;
    c.__jstorage_meta.CRC32[key] = value;
    setTTL(key, options.TTL || 0);
    B();
    return value;
  };

  const get = (key: string, defaultValue?: any) => {
    r(key);
    return c[key]
      ? c[key]._is_xml
        ? E.decode(c[key].xml)
        : c[key]
      : typeof defaultValue === "undefined"
        ? null
        : defaultValue;
  };

  const deleteKey = (key: string) => {
    r(key);
    if (key in c) {
      delete c[key];
      if (c.__jstorage_meta.TTL) {
        delete c.__jstorage_meta.TTL[key];
      }
      delete c.__jstorage_meta.CRC32[key];
      x();
      w();
      return true;
    }
    return false;
  };

  const setTTL = (key: string, ttl: number) => {
    r(key);
    ttl = Number(ttl) || 0;
    if (key in c) {
      c.__jstorage_meta.TTL = c.__jstorage_meta.TTL || {};
      if (ttl > 0) {
        c.__jstorage_meta.TTL[key] = new Date().getTime() + ttl;
      } else {
        delete c.__jstorage_meta.TTL[key];
      }
      x();
      w();
      return true;
    }
    return false;
  };

  const getTTL = (key: string) => {
    r(key);
    if (key in c && c.__jstorage_meta.TTL) {
      const ttl = c.__jstorage_meta.TTL[key] - new Date().getTime();
      return ttl || 0;
    }
    return 0;
  };

  const flush = () => {
    c = { __jstorage_meta: { CRC32: {} } };
    x();
    w();
    return true;
  };

  return {
    set,
    get,
    deleteKey,
    setTTL,
    getTTL,
    flush,
  };
})();

export default jStorageReact;
