"use strict";
(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [1754],
  {
    89324: (e, o, t) => {
      t.r(o),
        t.d(o, {
          Components: () => h,
          showDefaultSearchDialog: () => c,
          showSymbolSearchItemsDialog: () => s.showSymbolSearchItemsDialog,
        });
      var a = t(82992),
        l = (t(32563), t(79652)),
        n = t(94664),
        s = t(1861),
        r = t(64147),
        i = t(84015);
      t(56570), t(49483);
      !(0, i.isOnMobileAppPage)("any") &&
        window.matchMedia("(min-width: 602px) and (min-height: 445px)").matches;
      function c(e) {
        new r.WatchedValue({});
        const o = (0, n.getSymbolSearchCompleteOverrideFunction)(),
          {
            defaultValue: t,
            showSpreadActions: i,
            source: c,
            onSearchComplete: h,
            trackResultsOptions: m,
            ...d
          } = e,
          u = {
            ...d,
            showSpreadActions: null != i ? i : (0, l.canShowSpreadActions)(),
            onSymbolFiltersParamsChange: void 0,
            onSearchComplete: (e, t) => {
              null == t || t.symbolType;
              o(e[0].symbol, e[0].result).then((e) => {
                a.linking.setSymbolAndLogInitiator(e.symbol, "symbol search"),
                  null == h || h(e.symbol);
              });
            },
            onEmptyResults: void 0,
          };
        (0, s.showSymbolSearchItemsDialog)({ ...u, defaultValue: t });
      }
      const h = {
        SymbolSearchWatchlistDialogContentItem: null,
        SymbolSearchWatchlistDialog: null,
      };
    },
    1861: (e, o, t) => {
      t.d(o, { showSymbolSearchItemsDialog: () => i });
      var a = t(50959),
        l = t(50655),
        n = t(51826),
        s = t(73280),
        r = t(28124);
      function i(e) {
        const {
          initialMode: o = "symbolSearch",
          autofocus: t = !0,
          defaultValue: i,
          showSpreadActions: c,
          selectSearchOnInit: h,
          onSearchComplete: m,
          dialogTitle: d,
          placeholder: u,
          fullscreen: g,
          initialScreen: S,
          wrapper: p,
          dialog: y,
          contentItem: b,
          onClose: w,
          onOpen: C,
          footer: f,
          symbolTypes: O,
          searchInput: I,
          emptyState: M,
          hideMarkedListFlag: D,
          dialogWidth: v = "auto",
          manager: A,
          shouldReturnFocus: k,
          onSymbolFiltersParamsChange: F,
          onEmptyResults: R,
          customSearchSymbols: E,
        } = e;
        if (
          n.dialogsOpenerManager.isOpened("SymbolSearch") ||
          n.dialogsOpenerManager.isOpened("ChangeIntervalDialog")
        )
          return;
        const P = document.createElement("div"),
          T = a.createElement(
            l.SlotContext.Provider,
            { value: null != A ? A : null },
            a.createElement(s.SymbolSearchItemsDialog, {
              onClose: W,
              initialMode: o,
              defaultValue: i,
              showSpreadActions: c,
              hideMarkedListFlag: D,
              selectSearchOnInit: h,
              onSearchComplete: m,
              dialogTitle: d,
              placeholder: u,
              fullscreen: g,
              initialScreen: S,
              wrapper: p,
              dialog: y,
              contentItem: b,
              footer: f,
              symbolTypes: O,
              searchInput: I,
              emptyState: M,
              autofocus: t,
              dialogWidth: v,
              shouldReturnFocus: k,
              onSymbolFiltersParamsChange: F,
              onEmptyResults: R,
              customSearchSymbols: E,
            }),
          ),
          V = (0, r.createReactRoot)(T, P);
        function W() {
          V.unmount(),
            n.dialogsOpenerManager.setAsClosed("SymbolSearch"),
            w && w();
        }
        return (
          n.dialogsOpenerManager.setAsOpened("SymbolSearch"),
          C && C(),
          { close: W }
        );
      }
    },
    51826: (e, o, t) => {
      t.d(o, { DialogsOpenerManager: () => a, dialogsOpenerManager: () => l });
      class a {
        constructor() {
          this._storage = new Map();
        }
        setAsOpened(e, o) {
          this._storage.set(e, o);
        }
        setAsClosed(e) {
          this._storage.delete(e);
        }
        isOpened(e) {
          return this._storage.has(e);
        }
        getDialogPayload(e) {
          return this._storage.get(e);
        }
      }
      const l = new a();
    },
  },
]);
