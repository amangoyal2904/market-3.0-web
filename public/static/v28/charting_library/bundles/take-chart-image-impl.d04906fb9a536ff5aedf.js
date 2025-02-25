"use strict";
(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [4389],
  {
    7960: (e, t, a) => {
      a.r(t),
        a.d(t, {
          copyToClipboardClientScreenshot: () => u,
          copyToClipboardImageOfChart: () => h,
          downloadClientScreenshot: () => y,
          getImageOfChartSilently: () => g,
        });
      var n = a(31955),
        o = a(56570),
        i = a(52388),
        r = a(13665),
        c = a(65446),
        s = a(7372),
        l = a(7986),
        d = (a(21251), a(11542), a(67580));
      function w(e, t = {}) {
        return new Promise((a, n) => {
          !(async function (e, t, a, n = {}) {
            var i;
            const r = new FormData();
            if (void 0 !== n.previews)
              for (const e of n.previews) r.append("previews[]", e);
            void 0 !== n.cme && r.append("cme", String(n.cme));
            void 0 !== n.wl && r.append("wl", String(n.wl));
            void 0 !== n.onWidget && r.append("onWidget", String(n.onWidget));
            n.isReport && r.append("isReport", String(n.isReport));
            n.asyncSave && r.append("asyncSave", String(n.asyncSave));
            const c = window.urlParams;
            c && c.locale && r.append("language", c.locale);
            const s = e.activeChartWidget.value(),
              l = s.widgetCustomer();
            void 0 !== l && r.append("customer", l);
            const w =
              null !==
                (i = s.model().model().timezoneExceptExchange().value()) &&
              void 0 !== i
                ? i
                : "exchange";
            r.append("timezone", w),
              r.append("symbol", s.model().mainSeries().symbol());
            const p = await e.clientSnapshot({
                showHeaderMainSymbol: n.showHeaderMainSymbol,
              }),
              m = await new Promise((e) => p.toBlob(e));
            null !== m && r.append("preparedImage", m);
            !(async function (e, t, a, n = {}) {
              const i = o.enabled("charting_library_base")
                ? n.snapshotUrl || "https://www.tradingview.com/snapshot/"
                : "/snapshot/";
              try {
                const n = await (0, d.fetch)(i, {
                    body: e,
                    method: "POST",
                    credentials: "same-origin",
                  }),
                  o = await n.text();
                n.ok ? t(o) : a();
              } catch (e) {
                a();
              }
            })(r, t, a, n);
          })(e, a, n, t);
        });
      }
      const p = (0, n.getLogger)("Platform.TakeChartImage"),
        m = new i.DateTimeFormatter({
          dateTimeSeparator: "_",
          timeFormat: "%h-%m-%s",
        });
      async function h(e, t) {
        const a = "text/plain",
          n = w(e, t),
          i = n.then((e) =>
            o.enabled("charting_library_base") && t.snapshotUrl
              ? e
              : (0, l.convertImageNameToUrl)(e),
          ),
          r = i.then((e) => new Blob([e], { type: a }));
        try {
          return await (0, c.writePromiseUsingApi)(r, a), n;
        } catch (e) {
          throw (window.open(await i), e);
        }
      }
      async function g(e, t) {
        try {
          return await w(e, t);
        } catch (e) {
          throw (p.logWarn("Error while trying to create snapshot"), e);
        }
      }
      async function u(e) {
        const t = e.clientSnapshot(),
          a = t.then(
            (e) =>
              new Promise((t) =>
                e.toBlob((e) => {
                  null !== e && t(e);
                }),
              ),
          );
        try {
          return await (0, c.writePromiseUsingApi)(a, "image/png");
        } catch (e) {
          const a = window.open();
          throw (
            (a &&
              a.document.write(
                `<img width="100%" src="${(await t).toDataURL()}"/>`,
              ),
            e)
          );
        }
      }
      async function y(e) {
        const t = e.activeChartWidget
            .value()
            .model()
            .mainSeries()
            .actualSymbol(),
          a = `${(0, r.shortName)(t)}_${m.formatLocal(new Date())}`,
          n = await e.clientSnapshot();
        (0, s.downloadFile)(`${a}.png`, n.toDataURL());
      }
    },
    7986: (e, t, a) => {
      a.d(t, { convertImageNameToUrl: () => o });
      var n = a(56570);
      function o(e) {
        return n.enabled("charting_library_base")
          ? "https://www.tradingview.com/x/" + e + "/"
          : window.location.protocol +
              "//" +
              window.location.host +
              "/x/" +
              e +
              "/";
      }
    },
    7372: (e, t, a) => {
      function n(e, t) {
        const a = document.createElement("a");
        (a.style.display = "none"), (a.href = t), (a.download = e), a.click();
      }
      a.d(t, { downloadFile: () => n });
    },
  },
]);
