(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [9754, 1754, 9685, 361],
  {
    74786: (e, t, o) => {
      "use strict";
      o.d(t, { default: () => l });
      const l = function () {};
    },
    19016: (e) => {
      e.exports = {
        wrap: "wrap-HAxAr6QG",
        image: "image-HAxAr6QG",
        text: "text-HAxAr6QG",
      };
    },
    39274: (e) => {
      e.exports = { section: "section-Og4Rg_SK", heading: "heading-Og4Rg_SK" };
    },
    67358: (e) => {
      e.exports = {
        item: "item-nuuDM7vP",
        normal: "normal-nuuDM7vP",
        big: "big-nuuDM7vP",
        selected: "selected-nuuDM7vP",
        contentCell: "contentCell-nuuDM7vP",
        content: "content-nuuDM7vP",
        favourite: "favourite-nuuDM7vP",
        iconCell: "iconCell-nuuDM7vP",
        icon: "icon-nuuDM7vP",
        checkboxInput: "checkboxInput-nuuDM7vP",
        label: "label-nuuDM7vP",
      };
    },
    18087: (e) => {
      e.exports = {
        dialog: "dialog-UAy2ZKyS",
        wrap: "wrap-UAy2ZKyS",
        empty: "empty-UAy2ZKyS",
        image: "image-UAy2ZKyS",
        emptyState: "emptyState-UAy2ZKyS",
      };
    },
    79081: (e) => {
      e.exports = {
        menuWrap: "menuWrap-Kq3ruQo8",
        isMeasuring: "isMeasuring-Kq3ruQo8",
        scrollWrap: "scrollWrap-Kq3ruQo8",
        momentumBased: "momentumBased-Kq3ruQo8",
        menuBox: "menuBox-Kq3ruQo8",
        isHidden: "isHidden-Kq3ruQo8",
      };
    },
    83021: (e, t, o) => {
      "use strict";
      o.d(t, { SubmenuContext: () => n, SubmenuHandler: () => i });
      var l = o(50959);
      const n = l.createContext(null);
      function i(e) {
        const [t, o] = (0, l.useState)(null),
          i = (0, l.useRef)(null),
          a = (0, l.useRef)(new Map());
        return (
          (0, l.useEffect)(
            () => () => {
              null !== i.current && clearTimeout(i.current);
            },
            [],
          ),
          l.createElement(
            n.Provider,
            {
              value: {
                current: t,
                setCurrent: function (e) {
                  null !== i.current &&
                    (clearTimeout(i.current), (i.current = null));
                  null === t
                    ? o(e)
                    : (i.current = setTimeout(() => {
                        (i.current = null), o(e);
                      }, 100));
                },
                registerSubmenu: function (e, t) {
                  return (
                    a.current.set(e, t),
                    () => {
                      a.current.delete(e);
                    }
                  );
                },
                isSubmenuNode: function (e) {
                  return Array.from(a.current.values()).some((t) => t(e));
                },
              },
            },
            e.children,
          )
        );
      }
    },
    89324: (e, t, o) => {
      "use strict";
      o.r(t),
        o.d(t, {
          Components: () => c,
          showDefaultSearchDialog: () => h,
          showSymbolSearchItemsDialog: () => a.showSymbolSearchItemsDialog,
        });
      var l = o(82992),
        n = (o(32563), o(79652)),
        i = o(94664),
        a = o(1861),
        s = o(64147),
        r = o(84015);
      o(56570), o(49483);
      !(0, r.isOnMobileAppPage)("any") &&
        window.matchMedia("(min-width: 602px) and (min-height: 445px)").matches;
      function h(e) {
        new s.WatchedValue({});
        const t = (0, i.getSymbolSearchCompleteOverrideFunction)(),
          {
            defaultValue: o,
            showSpreadActions: r,
            source: h,
            onSearchComplete: c,
            trackResultsOptions: d,
            ...v
          } = e,
          u = {
            ...v,
            showSpreadActions: null != r ? r : (0, n.canShowSpreadActions)(),
            onSymbolFiltersParamsChange: void 0,
            onSearchComplete: (e, o) => {
              null == o || o.symbolType;
              t(e[0].symbol, e[0].result).then((e) => {
                l.linking.setSymbolAndLogInitiator(e.symbol, "symbol search"),
                  null == c || c(e.symbol);
              });
            },
            onEmptyResults: void 0,
          };
        (0, a.showSymbolSearchItemsDialog)({ ...u, defaultValue: o });
      }
      const c = {
        SymbolSearchWatchlistDialogContentItem: null,
        SymbolSearchWatchlistDialog: null,
      };
    },
    1861: (e, t, o) => {
      "use strict";
      o.d(t, { showSymbolSearchItemsDialog: () => r });
      var l = o(50959),
        n = o(50655),
        i = o(51826),
        a = o(73280),
        s = o(28124);
      function r(e) {
        const {
          initialMode: t = "symbolSearch",
          autofocus: o = !0,
          defaultValue: r,
          showSpreadActions: h,
          selectSearchOnInit: c,
          onSearchComplete: d,
          dialogTitle: v,
          placeholder: u,
          fullscreen: g,
          initialScreen: m,
          wrapper: p,
          dialog: w,
          contentItem: f,
          onClose: b,
          onOpen: y,
          footer: S,
          symbolTypes: T,
          searchInput: L,
          emptyState: x,
          hideMarkedListFlag: M,
          dialogWidth: C = "auto",
          manager: A,
          shouldReturnFocus: z,
          onSymbolFiltersParamsChange: k,
          onEmptyResults: E,
          customSearchSymbols: _,
        } = e;
        if (
          i.dialogsOpenerManager.isOpened("SymbolSearch") ||
          i.dialogsOpenerManager.isOpened("ChangeIntervalDialog")
        )
          return;
        const H = document.createElement("div"),
          P = l.createElement(
            n.SlotContext.Provider,
            { value: null != A ? A : null },
            l.createElement(a.SymbolSearchItemsDialog, {
              onClose: D,
              initialMode: t,
              defaultValue: r,
              showSpreadActions: h,
              hideMarkedListFlag: M,
              selectSearchOnInit: c,
              onSearchComplete: d,
              dialogTitle: v,
              placeholder: u,
              fullscreen: g,
              initialScreen: m,
              wrapper: p,
              dialog: w,
              contentItem: f,
              footer: S,
              symbolTypes: T,
              searchInput: L,
              emptyState: x,
              autofocus: o,
              dialogWidth: C,
              shouldReturnFocus: z,
              onSymbolFiltersParamsChange: k,
              onEmptyResults: E,
              customSearchSymbols: _,
            }),
          ),
          R = (0, s.createReactRoot)(P, H);
        function D() {
          R.unmount(),
            i.dialogsOpenerManager.setAsClosed("SymbolSearch"),
            b && b();
        }
        return (
          i.dialogsOpenerManager.setAsOpened("SymbolSearch"),
          y && y(),
          { close: D }
        );
      }
    },
    71043: (e, t, o) => {
      "use strict";
      o.r(t), o.d(t, { GlobalSearchDialogRenderer: () => qe });
      var l = o(50959),
        n = o(77788),
        i = o(29280),
        a = o(12481),
        s = o(11542),
        r = o(56840),
        h = o(68335),
        c = o(37265),
        d = o(69654),
        v = o(97754),
        u = o(9745),
        g = o(26843),
        m = o(45345),
        p = o(67562),
        w = o(66619),
        f = o(19016);
      function b(e) {
        const { text: t, showIcon: o = !0, className: n } = e,
          i = m.watchedTheme.value() === g.StdTheme.Dark ? w : p;
        return l.createElement(
          "div",
          { className: v(f.wrap, n) },
          o && l.createElement(u.Icon, { icon: i, className: f.image }),
          l.createElement("span", { className: f.text }, t),
        );
      }
      var y = o(79418),
        S = o(63651),
        T = o(98715),
        L = o(32470),
        x = o(74786),
        M = o(40173),
        C = o(5304),
        A = o(10772),
        z = o(67358);
      const k = (0, M.mergeThemes)(C.DEFAUL_CONTEXT_MENU_ITEM_THEME, z);
      function E(e) {
        const { action: t, isSelected: o, activeElRef: n, onExecute: i } = e;
        return l.createElement(A.ContextMenuAction, {
          theme: k,
          onShowSubMenu: x.default,
          isSubMenuOpened: !1,
          checkboxInput: !0,
          reference: n,
          selected: o,
          action: t,
          onExecute: i,
        });
      }
      var _ = o(39274);
      function H(e) {
        const {
          heading: t,
          selectedId: o,
          items: n,
          activeElRef: i,
          onExecute: a,
        } = e;
        return l.createElement(
          "table",
          { className: _.section },
          l.createElement(
            "tbody",
            null,
            l.createElement(
              "tr",
              null,
              l.createElement("td", { className: _.heading }, t),
            ),
            n.map((e) =>
              l.createElement(E, {
                key: e.id,
                action: e,
                isSelected: e.id === o,
                activeElRef: e.id === o ? i : void 0,
                onExecute: a,
              }),
            ),
          ),
        );
      }
      var P = o(18087);
      const R = [
        { name: "drawingsActions", label: s.t(null, void 0, o(74385)) },
        { name: "functionActions", label: s.t(null, void 0, o(83576)) },
        { name: "settingsActions", label: s.t(null, void 0, o(32514)) },
      ];
      function D(e) {
        const { dialogId: t, items: n, onClose: i, shouldReturnFocus: v } = e,
          [u, g] = (0, l.useState)(""),
          [m, p] = (0, l.useState)([]),
          w = (0, l.useRef)(null),
          f = (0, l.useRef)(null),
          { activeIdx: x, setActiveIdx: M } = (0, S.useKeyboardNavigation)(
            w.current,
            m,
            function (e, t) {
              t.preventDefault();
              const o = m[x];
              o &&
                !o.isDisabled() &&
                (o.execute(), o.isCheckable() ? A() : i());
            },
            "keyup",
          );
        (0, L.useResetActiveIdx)(M, [u, n]),
          (0, T.useScrollToRef)(f, x),
          (0, l.useEffect)(() => {
            var e;
            null === (e = w.current) || void 0 === e || e.focus();
          }, []),
          (0, l.useEffect)(() => {
            const e = w.current;
            if (e)
              return (
                e.addEventListener("input", _),
                _(),
                () => {
                  e && e.removeEventListener("input", _);
                }
              );
          }, []);
        const C = (0, l.useCallback)(
            (0, a.default)((e) => {}, 1e3),
            [],
          ),
          A = (0, l.useCallback)((0, a.default)(i, 200), []);
        (0, l.useEffect)(
          () => () => {
            C.flush(), A.cancel();
          },
          [],
        );
        const z = (0, l.useMemo)(() => {
            const e = new Set(r.getJSON("GlobalSearchDialog.recent", [])),
              t = [];
            for (const o of e) {
              const e = n.find((e) => e.getState().id === o);
              e && t.push(e);
            }
            return t.reverse(), t;
          }, []),
          k = (0, l.useMemo)(
            () =>
              R.reduce(
                (e, t) => (
                  e.set(
                    t.name,
                    m.filter((e) => e.getState().category === t.name),
                  ),
                  e
                ),
                new Map(),
              ),
            [m],
          );
        return l.createElement(y.AdaptivePopupDialog, {
          dataName: t,
          title: s.t(null, void 0, o(79354)),
          onClose: i,
          onClickOutside: i,
          shouldReturnFocus: v,
          render: () =>
            l.createElement(
              l.Fragment,
              null,
              l.createElement(d.DialogSearch, { reference: w }),
              l.createElement(
                "div",
                { className: P.wrap },
                u
                  ? l.createElement(
                      l.Fragment,
                      null,
                      m.length
                        ? R.map((e) => {
                            const t = k.get(e.name);
                            return t && t.length
                              ? l.createElement(H, {
                                  key: e.name,
                                  heading: e.label,
                                  items: t,
                                  selectedId: D(),
                                  activeElRef: f,
                                  onExecute: E,
                                })
                              : null;
                          })
                        : l.createElement(b, {
                            text: s.t(null, void 0, o(47202)),
                            className: P.emptyState,
                          }),
                    )
                  : l.createElement(
                      l.Fragment,
                      null,
                      Boolean(m.length)
                        ? l.createElement(H, {
                            heading: s.t(null, void 0, o(76753)),
                            selectedId: D(),
                            activeElRef: f,
                            items: m,
                            onExecute: E,
                          })
                        : l.createElement(b, {
                            text: s.t(null, void 0, o(27463)),
                            showIcon: !1,
                            className: P.emptyState,
                          }),
                    ),
              ),
            ),
          className: P.dialog,
          onKeyDown: function (e) {
            27 === (0, h.hashFromEvent)(e) && (e.preventDefault(), i());
          },
          isOpened: !0,
        });
        function E(e) {
          e.getState().checkable ? A() : i();
        }
        function _() {
          const e = w.current ? w.current.value.toLocaleLowerCase().trim() : "";
          if ((g(e), e)) {
            const t = n
              .filter(
                (t) =>
                  V(t).includes(e) ||
                  (function (e, t) {
                    const { aliases: o } = t.getState();
                    if (o) return o.some((t) => t.toLowerCase().includes(e));
                    return !1;
                  })(e, t),
              )
              .sort((t) => (V(t) === e ? -1 : 0));
            p(t), t.length || C(e);
          } else p(z);
        }
        function D() {
          return -1 !== x ? m[x].id : null;
        }
        function V(e) {
          const { label: t } = e.getState();
          return (0, c.isString)(t) ? t.toLocaleLowerCase() : "";
        }
      }
      var V,
        I = o(82992),
        F = o(86235),
        Z = o(34585),
        O = o(56570),
        B = (o(630), o(45579), o(72708), o(97702));
      !(function (e) {
        (e.Drawings = "drawingsActions"),
          (e.Function = "functionActions"),
          (e.Settings = "settingsActions");
      })(V || (V = {}));
      class W extends B.Action {
        constructor({
          id: e,
          category: t,
          favourite: o,
          onFavouriteClick: l,
          hotkeyGroup: n,
          hotkeyHash: i,
          aliases: a,
          optionsLoader: s,
          ...h
        }) {
          super({
            actionId: "UnknownAction",
            options: { ...h, doNotCloseOnClick: !0 },
            id: e,
            optionsLoader: s,
          }),
            (this.execute = () => {
              super.execute();
              const e = new Set(r.getJSON("GlobalSearchDialog.recent", [])),
                t = this._searchOptions.id;
              e.has(t) && e.delete(t),
                e.add(t),
                r.setJSON(
                  "GlobalSearchDialog.recent",
                  Array.from(e).slice(-10),
                );
            }),
            (this.getState = () => ({
              ...super.getState(),
              id: this._searchOptions.id,
              category: this._searchOptions.category,
              favourite: this._searchOptions.favourite,
              onFavouriteClick: this._onFavouriteClick,
              aliases: this._searchOptions.aliases,
            })),
            (this.update = (e) => {
              (this._searchOptions = Object.assign(this._searchOptions, e)),
                super.update(e);
            }),
            (this._onFavouriteClick = (e) => {
              this._searchOptions.onFavouriteClick &&
                (this.update({ favourite: !this._searchOptions.favourite }),
                this._searchOptions.onFavouriteClick(e));
            }),
            (this._searchOptions = {
              id: e,
              category: t,
              favourite: o,
              onFavouriteClick: l,
              aliases: a,
            });
        }
      }
      var N,
        K = o(45126),
        G = o(49483),
        U = o(19475);
      !(function (e) {
        (e.None = "all"), (e.Following = "following"), (e.Private = "private");
      })(N || (N = {}));
      var q = o(99531),
        j = o(42989),
        Q = o(23076),
        J = o(85662);
      function $(e) {
        const t = e.match(/^(\d+).(\d+).(\d+)/);
        if (!t) return null;
        const [, o, l, n] = t;
        return [parseInt(o), parseInt(l), parseInt(n)];
      }
      function Y(e) {
        const t = (0, G.desktopAppVersion)();
        return (
          !!t &&
          (function (e, t) {
            const o = $(e),
              l = $(t);
            if (!o || !l) return !1;
            const [n, i, a] = o,
              [s, r, h] = l;
            return n !== s ? n < s : i !== r ? i < r : a !== h && a < h;
          })(t, e)
        );
      }
      const X = (e) => {
        const t = (t) => {
          const l = [];
          if (
            (t &&
              t.length &&
              window.is_authenticated &&
              t.forEach((t) => {
                l.push(
                  new W({
                    id: t,
                    category: "settingsActions",
                    label: `${s.t(null, void 0, o(91022))} ${J.translateStdThemeName(t)}`,
                    onExecute: () => {
                      J.loadTheme(e.chartWidgetCollection(), {
                        themeName: t,
                        standardTheme: !1,
                      }).then(() => {
                        e.readOnly() || window.saver.saveChartSilently();
                      });
                    },
                  }),
                );
              }),
            !(0, G.isDesktopApp)() || Y("1.0.10"))
          ) {
            const [t, n] = J.getStdThemeNames();
            l.push(
              new W({
                id: "DarkColorTheme",
                category: "settingsActions",
                label: s.t(null, void 0, o(7931)),
                checkable: !0,
                checked: J.getCurrentTheme().name === n,
                onExecute: () => {
                  const o = J.getCurrentTheme().name === n ? t : n;
                  J.loadTheme(e.chartWidgetCollection(), {
                    themeName: o,
                    standardTheme: !0,
                  }).then(() => {
                    e.readOnly() || window.saver.saveChartSilently();
                  });
                },
              }),
            );
          }
          return l;
        };
        return window.is_authenticated
          ? J.getThemeNames().then(t)
          : Promise.resolve(t());
      };
      var ee = o(928),
        te = o(81171);
      o(55917);
      var oe = o(92693),
        le = o(84243),
        ne = o(90995);
      const { DrawingSyncMode: ie } = ee,
        ae = {
          drawings: "ToggleHideAllDrawingTools",
          indicators: "ToggleHideAllIndicators",
          positions: "ToggleHideAllPositions",
          all: "ToggleHideAll",
        },
        se = new K.TranslatedString(
          "stay in drawing mode",
          s.t(null, void 0, o(4114)),
        ),
        re = new K.TranslatedString(
          "sync drawings",
          s.t(null, void 0, o(94521)),
        ),
        he = s.t(null, void 0, o(62518)),
        ce = s.t(null, void 0, o(23391)),
        de =
          (s.t(null, void 0, o(93027)),
          s.t(null, void 0, o(3521)),
          s.t(null, void 0, o(79451))),
        ve = s.t(null, void 0, o(3519)),
        ue = s.t(null, void 0, o(94593));
      var ge = o(80387),
        me = o(62400),
        pe = o(89324);
      class we extends W {
        constructor(e) {
          super({
            label: s.t(null, void 0, o(37189)),
            id: "InvertScale",
            category: "settingsActions",
            checkable: !0,
            onExecute: () => {
              this._model.invertPriceScale(
                this._model.mainSeries().priceScale(),
              );
            },
            shortcutHint: (0, h.humanReadableHash)(h.Modifiers.Alt + 73),
          }),
            (this._model = e);
          (this._props = this._model
            .mainSeries()
            .priceScale()
            .properties()
            .childs().isInverted).subscribe(this, () => {
            this._onUpdate.fire(this);
          });
        }
        destroy() {
          super.destroy(), this._props.unsubscribeAll(this);
        }
        isChecked() {
          return this._model.mainSeries().priceScale().isInverted();
        }
      }
      class fe extends W {
        constructor(e) {
          super({
            label: s.t(null, void 0, o(6919)),
            checkable: !0,
            id: "TogglePercantage",
            category: "settingsActions",
            onExecute: () => {
              this.isChecked()
                ? this._model.setPriceScaleRegularScaleMode(
                    this._model.mainSeries().priceScale(),
                  )
                : this._model.togglePriceScalePercentageScaleMode(
                    this._model.mainSeries().priceScale(),
                  );
            },
            shortcutHint: (0, h.humanReadableHash)(h.Modifiers.Alt + 80),
            disabled:
              e.mainSeries().priceScale().isLockScale() ||
              6 === e.mainSeries().properties().childs().style.value(),
            checked: e.mainSeries().priceScale().isPercentage(),
          }),
            (this._model = e);
          (this._props = this._model
            .mainSeries()
            .priceScale()
            .properties()
            .childs().percentage).subscribe(this, () => {
            this._onUpdate.fire(this);
          });
        }
        destroy() {
          super.destroy(), this._props.unsubscribeAll(this);
        }
        isChecked() {
          return this._model.mainSeries().priceScale().isPercentage();
        }
      }
      class be extends W {
        constructor(e) {
          super({
            label: s.t(null, void 0, o(16170)),
            id: "ToggleLogScale",
            category: "settingsActions",
            checkable: !0,
            onExecute: () => {
              this.isChecked()
                ? this._model.setPriceScaleRegularScaleMode(
                    this._model.mainSeries().priceScale(),
                  )
                : this._model.togglePriceScaleLogScaleMode(
                    this._model.mainSeries().priceScale(),
                  );
            },
            shortcutHint: (0, h.humanReadableHash)(h.Modifiers.Alt + 76),
            disabled:
              e.mainSeries().priceScale().isLockScale() ||
              6 === e.mainSeries().properties().childs().style.value(),
            checked: e.mainSeries().priceScale().isLog(),
          }),
            (this._model = e);
          (this._props = this._model
            .mainSeries()
            .priceScale()
            .properties()
            .childs().log).subscribe(this, () => {
            this._onUpdate.fire(this);
          });
        }
        destroy() {
          super.destroy(), this._props.unsubscribeAll(this);
        }
        isChecked() {
          return this._model.mainSeries().priceScale().isLog();
        }
      }
      var ye = o(27906);
      const Se = O.enabled("show_average_close_price_line_and_label"),
        Te = new K.TranslatedString(
          "change session",
          s.t(null, void 0, o(87041)),
        ),
        Le = new K.TranslatedString(
          "change plus button visibility",
          s.t(null, void 0, o(96379)),
        ),
        xe = new K.TranslatedString(
          "change countdown to bar close visibility",
          s.t(null, void 0, o(39383)),
        ),
        Me = new K.TranslatedString(
          "scale price chart only",
          s.t(null, void 0, o(63796)),
        ),
        Ce = new K.TranslatedString(
          "change symbol last value visibility",
          s.t(null, void 0, o(67453)),
        ),
        Ae = new K.TranslatedString(
          "change high and low price labels visibility",
          s.t(null, void 0, o(24226)),
        ),
        ze = new K.TranslatedString(
          "change average close price label visibility",
          s.t(null, void 0, o(76852)),
        ),
        ke = new K.TranslatedString(
          "change indicators and financials value labels visibility",
          s.t(null, void 0, o(71161)),
        ),
        Ee = new K.TranslatedString(
          "change indicators and financials name labels visibility",
          s.t(null, void 0, o(12411)),
        ),
        _e = new K.TranslatedString(
          "change high and low price lines visibility",
          s.t(null, void 0, o(80692)),
        ),
        He = new K.TranslatedString(
          "change average close price line visibility",
          s.t(null, void 0, o(1022)),
        ),
        Pe = new K.TranslatedString(
          "change symbol labels visibility",
          s.t(null, void 0, o(73357)),
        ),
        Re =
          (new K.TranslatedString(
            "change pre/post market price label visibility",
            s.t(null, void 0, o(30870)),
          ),
          new K.TranslatedString(
            "change symbol previous close value visibility",
            s.t(null, void 0, o(4729)),
          ),
          new K.TranslatedString(
            "change previous close price line visibility",
            s.t(null, void 0, o(58419)),
          )),
        De =
          (new K.TranslatedString(
            "change bid and ask labels visibility",
            s.t(null, void 0, o(69362)),
          ),
          new K.TranslatedString(
            "change bid and ask lines visibility",
            s.t(null, void 0, o(52919)),
          ),
          new K.TranslatedString(
            "change pre/post market price lines visibility",
            s.t(null, void 0, o(91978)),
          ),
          new K.TranslatedString(
            "change price line visibility",
            s.t(null, void 0, o(8662)),
          )),
        Ve = new K.TranslatedString(
          "change session breaks visibility",
          s.t(null, void 0, o(38413)),
        ),
        Ie =
          (new K.TranslatedString(
            "change ideas visibility on chart",
            s.t(null, void 0, o(13489)),
          ),
          new K.TranslatedString("show all ideas", s.t(null, void 0, o(13336))),
          new K.TranslatedString(
            "show ideas of followed users",
            s.t(null, void 0, o(91395)),
          ),
          new K.TranslatedString(
            "show my ideas only",
            s.t(null, void 0, o(57460)),
          ),
          new K.TranslatedString(
            "change events visibility on chart",
            s.t(null, void 0, o(6119)),
          ),
          new K.TranslatedString(
            "change earnings visibility",
            s.t(null, void 0, o(6819)),
          ),
          new K.TranslatedString(
            "change dividends visibility",
            s.t(null, void 0, o(53929)),
          ),
          new K.TranslatedString(
            "change splits visibility",
            s.t(null, void 0, o(47474)),
          ),
          {
            0: s.t(null, void 0, o(19265)),
            1: s.t(null, void 0, o(64526)),
            9: s.t(null, void 0, o(44958)),
            2: s.t(null, void 0, o(92911)),
            14: s.t(null, void 0, o(35458)),
            15: s.t(null, void 0, o(40447)),
            3: s.t(null, void 0, o(9537)),
            16: s.t(null, void 0, o(39883)),
            4: s.t(null, void 0, o(80082)),
            7: s.t(null, void 0, o(11604)),
            5: s.t(null, void 0, o(47189)),
            6: s.t(null, void 0, o(22027)),
            8: s.t(null, void 0, o(62423)),
            10: s.t(null, void 0, o(19579)),
            11: s.t(null, void 0, o(49942)),
            12: s.t(null, void 0, o(70405)),
            13: s.t(null, void 0, o(56281)),
            17: s.t(null, void 0, o(21190)),
            18: s.t(null, void 0, o(94861)),
            19: s.t(null, void 0, o(13618)),
            20: s.t(null, void 0, o(67346)),
          });
      async function Fe(e) {
        var t, l, n, i, a, r, c, d;
        const v = [],
          [u, g] = await Promise.all([X(e), Promise.resolve(null)]),
          m = ((e) => {
            const t = [],
              {
                stayInDrawingMode: o,
                drawOnAllCharts: l,
                drawOnAllChartsMode: n,
              } = ee.properties().childs();
            t.push(
              new W({
                label: he,
                checkable: !0,
                checked: o.value(),
                id: "ToggleStayInDrawingMode",
                category: "settingsActions",
                onExecute: () => {
                  e.model().setProperty(o, !o.value(), se);
                },
              }),
            ),
              t.push(
                new W({
                  label: ce,
                  checkable: !0,
                  id: "ToggleSyncDrawings",
                  category: "settingsActions",
                  checked: l.value(),
                  disabled: !e.isMultipleLayout().value(),
                  onExecute: () => {
                    e.model().setProperty(l, !l.value(), re);
                  },
                }),
              );
            const i = ee.lockDrawings();
            t.push(
              new W({
                label: de,
                checkable: !0,
                id: "ToggleLockDrawings",
                category: "settingsActions",
                checked: i.value(),
                onExecute: () => {
                  ee.lockDrawings().setValue(!ee.lockDrawings().value());
                },
              }),
            );
            const a = (0, ne.getSavedHideMode)();
            t.push(
              ...Array.from((0, ne.getHideOptions)()).map(
                ([e, t]) =>
                  new W({
                    label: t.tooltip.inactive,
                    checkable: !0,
                    id: ae[e],
                    category: "settingsActions",
                    checked: a === e && (0, ne.getHideModeStateValue)(e),
                    onExecute: () => (0, ne.toggleHideMode)(e),
                  }),
              ),
            );
            const { magnet: s, magnetMode: r } = ee.properties().childs();
            return (
              t.push(
                new W({
                  label: ve,
                  checkable: !0,
                  id: "WeakMagnet",
                  category: "functionActions",
                  checked: s.value() && r.value() === oe.MagnetMode.WeakMagnet,
                  icon: le.drawingToolsIcons.magnet,
                  onExecute: () => {
                    s.value() && r.value() === oe.MagnetMode.WeakMagnet
                      ? (0, te.setIsMagnetEnabled)(!1)
                      : (0, te.setMagnetMode)(oe.MagnetMode.WeakMagnet);
                  },
                }),
              ),
              t.push(
                new W({
                  label: ue,
                  checkable: !0,
                  id: "StrongMagnet",
                  category: "functionActions",
                  checked:
                    s.value() && r.value() === oe.MagnetMode.StrongMagnet,
                  icon: le.drawingToolsIcons.strongMagnet,
                  onExecute: () => {
                    s.value() && r.value() === oe.MagnetMode.StrongMagnet
                      ? (0, te.setIsMagnetEnabled)(!1)
                      : (0, te.setMagnetMode)(oe.MagnetMode.StrongMagnet);
                  },
                }),
              ),
              t
            );
          })(e),
          p = (function (e) {
            const t = [];
            return (
              O.enabled("header_widget") &&
                O.enabled("header_compare") &&
                t.push(
                  new W({
                    icon: o(1393),
                    label: (0, Z.appendEllipsis)(s.t(null, void 0, o(57e3))),
                    id: "Compare",
                    category: "functionActions",
                    onExecute: () => e.toggleCompareOrAdd(),
                  }),
                ),
              O.enabled("header_widget") &&
                O.enabled("header_indicators") &&
                t.push(
                  new W({
                    icon: o(39681),
                    label: (0, Z.appendEllipsis)(s.t(null, void 0, o(87829))),
                    id: "InsertIndicator",
                    category: "functionActions",
                    onExecute: () => {
                      e.showIndicators([]);
                    },
                    shortcutHint: e.options().indicatorsDialogShortcutEnabled
                      ? (0, h.humanReadableHash)(47)
                      : void 0,
                  }),
                ),
              O.enabled("show_object_tree") &&
                t.push(
                  new W({
                    icon: o(30192),
                    label: s.t(null, void 0, o(27077)),
                    id: "OpenObjectsTreeInRightPanel",
                    category: "functionActions",
                    onExecute: () => e.showObjectsTreePanelOrDialog(),
                  }),
                ),
              O.enabled("header_widget") &&
                O.enabled("header_settings") &&
                t.push(
                  new W({
                    label: (0, Z.appendEllipsis)(s.t(null, void 0, o(32514))),
                    icon: o(34369),
                    id: "ChartProperties",
                    category: "functionActions",
                    onExecute: () => {
                      e.showGeneralChartProperties();
                    },
                  }),
                ),
              O.enabled("header_widget") &&
                O.enabled("header_symbol_search") &&
                t.push(
                  new W({
                    icon: o(69859),
                    label: (0, Z.appendEllipsis)(s.t(null, void 0, o(63245))),
                    id: "ChangeSymbol",
                    category: "functionActions",
                    onExecute: () => {
                      (0, pe.showDefaultSearchDialog)({
                        defaultValue: "",
                        trackResultsOptions: void 0,
                      });
                    },
                  }),
                ),
              O.enabled("symbol_info") &&
                t.push(
                  new W({
                    label: (0, Z.appendEllipsis)(s.t(null, void 0, o(75594))),
                    icon: o(37924),
                    id: "SymbolInfo",
                    category: "functionActions",
                    onExecute: () => {
                      {
                        const t = e.model().model(),
                          o = t.mainSeries().symbolInfo(),
                          l = t.availableUnits(),
                          n = {
                            symbolInfo: o,
                            showUnit: t.unitConversionEnabled(),
                            unitDescription: (e) => (e ? l.description(e) : ""),
                            dateFormatter: t.dateFormatter(),
                          };
                        return void (0, ge.showSymbolInfoDialog)(n);
                      }
                    },
                  }),
                ),
              e.options().goToDateEnabled &&
                t.push(
                  new W({
                    label: (0, Z.appendEllipsis)(s.t(null, void 0, o(54280))),
                    icon: o(90752),
                    id: "GoToDate",
                    category: "functionActions",
                    onExecute: () => {
                      (0, me.showGoToDateDialog)(e);
                    },
                    shortcutHint: (0, h.humanReadableHash)(
                      h.Modifiers.Alt + 71,
                    ),
                  }),
                ),
              t
            );
          })(e);
        v.push(...u, ...m, ...p), g && v.push(...g);
        const w = e.model().mainSeries(),
          f = w.priceScale(),
          b = w.properties().childs(),
          y =
            null === (l = (t = e.model()).paneForSource) || void 0 === l
              ? void 0
              : l.call(t, w);
        v.push(
          new W({
            id: "ResetPriceScale",
            category: "functionActions",
            label: s.t(null, void 0, o(15332)),
            icon: o(39267),
            onExecute: () => {
              y && e.model().resetPriceScale(y, f);
            },
            shortcutHint: (0, h.humanReadableHash)(h.Modifiers.Alt + 82),
          }),
        ),
          v.push(new we(e.model())),
          v.push(new fe(e.model())),
          v.push(new be(e.model()));
        const S = f.isLockScale(),
          T = 6 === b.style.value();
        v.push(
          new W({
            label: s.t(null, void 0, o(28051)),
            checkable: !0,
            id: "SetRegularSessionId",
            category: "functionActions",
            disabled: Boolean(
              "regular" ===
                (null === (n = w.symbolInfo()) || void 0 === n
                  ? void 0
                  : n.subsession_id),
            ),
            onExecute: () => {
              e.model().setProperty(b.sessionId, "regular", Te);
            },
            checked: Boolean(
              "regular" ===
                (null === (i = w.symbolInfo()) || void 0 === i
                  ? void 0
                  : i.subsession_id),
            ),
          }),
        ),
          v.push(
            new W({
              label: s.t(null, void 0, o(93308)),
              checkable: !0,
              id: "SetExtendedSessionId",
              category: "functionActions",
              disabled: !(null ===
                (r =
                  null === (a = w.symbolInfo()) || void 0 === a
                    ? void 0
                    : a.subsessions) || void 0 === r
                ? void 0
                : r.some((e) => !e.private && "extended" === e.id)),
              onExecute: () => {
                var t;
                const o =
                  "extended" ===
                  (null === (t = w.symbolInfo()) || void 0 === t
                    ? void 0
                    : t.subsession_id)
                    ? "regular"
                    : "extended";
                e.model().setProperty(b.sessionId, o, Te);
              },
              checked: Boolean(
                "extended" ===
                  (null === (c = w.symbolInfo()) || void 0 === c
                    ? void 0
                    : c.subsession_id),
              ),
            }),
          ),
          v.push(
            new W({
              label: s.t(null, void 0, o(14017)),
              checkable: !0,
              id: "ToggleLockScale",
              category: "settingsActions",
              onExecute: () => {
                e.model().togglePriceScaleLockScaleMode(
                  e.model().mainSeries().priceScale(),
                );
              },
              checked: f.isLockScale(),
            }),
          ),
          v.push(
            new W({
              label: s.t(null, void 0, o(89999)),
              checkable: !0,
              id: "ToggleIndexedTo100",
              category: "settingsActions",
              onExecute: () => {
                f.isIndexedTo100()
                  ? e
                      .model()
                      .setPriceScaleRegularScaleMode(
                        e.model().mainSeries().priceScale(),
                      )
                  : e
                      .model()
                      .togglePriceScaleIndexedTo100ScaleMode(
                        e.model().mainSeries().priceScale(),
                      );
              },
              disabled: S || T,
              checked: f.isIndexedTo100(),
            }),
          ),
          v.push(
            new W({
              id: "AutoFitsToScreen",
              category: "settingsActions",
              label: s.t(null, void 0, o(24157)),
              checkable: !0,
              onExecute: () => {
                e.model().togglePriceScaleAutoScaleMode(f);
              },
              checked: f.isAutoScale(),
              disabled: f.properties().childs().autoScaleDisabled.value(),
            }),
          ),
          v.push(
            new W({
              label: s.t(null, { context: "scale_menu" }, o(55300)),
              checkable: !0,
              id: "ToggleRegularScale",
              category: "settingsActions",
              onExecute: () => {
                e.model().setPriceScaleRegularScaleMode(f);
              },
              disabled: S || T || f.isRegular(),
              checked: f.isRegular(),
            }),
          );
        const L = e.model().model().priceScaleSlotsCount(),
          x = 0 === L.left;
        v.push(
          new W({
            label: x
              ? s.t(null, void 0, o(26493))
              : s.t(null, void 0, o(40789)),
            id: "MoveScaleToSide",
            category: "functionActions",
            disabled: L.left + L.right !== 1,
            onExecute: () => {
              e.model().mergeAllScales(x ? "left" : "right");
            },
          }),
        ),
          v.push(
            new W({
              label: s.t(null, void 0, o(7276)),
              id: "MergeAllScalesToLeft",
              category: "functionActions",
              disabled: L.left + L.right === 1,
              onExecute: () => {
                e.model().mergeAllScales("left");
              },
            }),
          ),
          v.push(
            new W({
              label: s.t(null, void 0, o(80219)),
              id: "MergeAllScalesToRight",
              category: "functionActions",
              disabled: L.left + L.right === 1,
              onExecute: () => {
                e.model().mergeAllScales("right");
              },
            }),
          ),
          v.push(
            new W({
              label: s.t(null, void 0, o(71566)),
              checkable: !0,
              checked: U.addPlusButtonProperty.value(),
              id: "ToggleAddOrderPlusButton",
              category: "settingsActions",
              onExecute: () => {
                e.model().setProperty(
                  U.addPlusButtonProperty,
                  !U.addPlusButtonProperty.value(),
                  Le,
                );
              },
            }),
          );
        const M = e.properties().childs().scalesProperties.childs(),
          C = b.showCountdown;
        v.push(
          new W({
            label: s.t(null, void 0, o(83140)),
            checkable: !0,
            id: "ToggleCountdown",
            category: "settingsActions",
            checked: C.value(),
            onExecute: () => {
              e.model().setProperty(C, !C.value(), xe);
            },
          }),
        );
        const A = M.scaleSeriesOnly;
        v.push(
          new W({
            label: s.t(null, void 0, o(43758)),
            checkable: !0,
            id: "ScalePriceChartOnly",
            category: "settingsActions",
            checked: A.value(),
            onExecute: () => {
              e.model().setProperty(A, !A.value(), Me);
            },
          }),
        );
        const z = M.showSeriesLastValue;
        v.push(
          new W({
            label: s.t(null, void 0, o(10127)),
            checkable: !0,
            id: "ToggleSymbolLastValue",
            category: "settingsActions",
            checked: z.value(),
            onExecute: () => {
              e.model().setProperty(z, !z.value(), Ce);
            },
          }),
        );
        const k = b.highLowAvgPrice.childs();
        v.push(
          new W({
            label: s.t(null, void 0, o(99479)),
            checkable: !0,
            id: "ToggleHighLowPriceLabels",
            category: "settingsActions",
            checked: k.highLowPriceLabelsVisible.value(),
            onExecute: () => {
              e.model().setProperty(
                k.highLowPriceLabelsVisible,
                !k.highLowPriceLabelsVisible.value(),
                Ae,
              );
            },
          }),
        ),
          Se &&
            v.push(
              new W({
                label: s.t(null, void 0, o(21841)),
                checkable: !0,
                id: "ToggleAverageClosePriceLabel",
                category: "settingsActions",
                checked: k.averageClosePriceLabelVisible.value(),
                onExecute: () => {
                  const t = !k.averageClosePriceLabelVisible.value();
                  e.model().setProperty(k.averageClosePriceLabelVisible, t, ze);
                },
              }),
            );
        const E = M.showSymbolLabels;
        v.push(
          new W({
            label: s.t(null, void 0, o(32390)),
            checkable: !0,
            id: "ToggleSymbolLabels",
            category: "settingsActions",
            checked: E.value(),
            onExecute: () => {
              e.model().setProperty(E, !E.value(), Pe);
            },
          }),
        );
        const _ = (0, q.combineProperty)(
          (e, t) => e || t,
          M.showStudyLastValue.weakReference(),
          M.showFundamentalLastValue.weakReference(),
        );
        v.push(
          new W({
            label: s.t(null, void 0, o(46850)),
            checkable: !0,
            id: "ToggleStudyLastValue",
            category: "settingsActions",
            checked: _.value(),
            onExecute: () => {
              const t = !_.value();
              e.model().beginUndoMacro(ke),
                e.model().setProperty(M.showStudyLastValue, t, null),
                e.model().setProperty(M.showFundamentalLastValue, t, null),
                e.model().endUndoMacro();
            },
            onDestroy: () => {
              _.destroy();
            },
          }),
        );
        const H = (0, q.combineProperty)(
          (e, t) => e || t,
          M.showStudyPlotLabels.weakReference(),
          M.showFundamentalNameLabel.weakReference(),
        );
        v.push(
          new W({
            label: s.t(null, void 0, o(54418)),
            checkable: !0,
            id: "ToggleIndicatorsLabels",
            category: "settingsActions",
            checked: H.value(),
            onExecute: () => {
              e.model().beginUndoMacro(Ee);
              const t = !H.value();
              e.model().setProperty(M.showStudyPlotLabels, t, null),
                e.model().setProperty(M.showFundamentalNameLabel, t, null),
                e.model().endUndoMacro();
            },
            onDestroy: () => {
              H.destroy();
            },
          }),
        ),
          v.push(
            new W({
              label: s.t(null, void 0, o(33766)),
              checkable: !0,
              id: "ToggleHighLowPriceLines",
              category: "settingsActions",
              checked: k.highLowPriceLinesVisible.value(),
              onExecute: () => {
                e.model().setProperty(
                  k.highLowPriceLinesVisible,
                  !k.highLowPriceLinesVisible.value(),
                  _e,
                );
              },
            }),
          ),
          Se &&
            v.push(
              new W({
                label: s.t(null, void 0, o(16138)),
                checkable: !0,
                id: "ToggleAverageClosePriceLine",
                category: "settingsActions",
                checked: k.averageClosePriceLineVisible.value(),
                onExecute: () => {
                  const t = !k.averageClosePriceLineVisible.value();
                  e.model().setProperty(k.averageClosePriceLineVisible, t, He);
                },
              }),
            );
        const P = b.showPriceLine;
        v.push(
          new W({
            label: s.t(null, void 0, o(72926)),
            checkable: !0,
            id: "TogglePriceLine",
            category: "settingsActions",
            checked: P.value(),
            onExecute: () => {
              e.model().setProperty(P, !P.value(), De);
            },
          }),
        );
        const R = b.showPrevClosePriceLine;
        v.push(
          new W({
            label: s.t(null, void 0, o(79366)),
            checkable: !0,
            id: "ToggleSymbolPrevCloseLine",
            disabled: e.model().mainSeries().isDWM(),
            category: "settingsActions",
            checked: R.value(),
            onExecute: () => {
              e.model().setProperty(R, !R.value(), Re);
            },
          }),
        ),
          v.push(
            new W({
              label: s.t(null, void 0, o(54170)),
              icon: o(39267),
              id: "ResetTimeScale",
              category: "functionActions",
              onExecute: () => {
                e.model().resetTimeScale();
              },
              shortcutHint: (0, h.humanReadableHash)(
                h.Modifiers.Mod + h.Modifiers.Alt + 81,
              ),
            }),
          );
        const D = e.model().model().sessions();
        let V;
        const F = (0, q.createWVFromProperty)(
            e.model().mainSeries().isDWMProperty(),
          ),
          B = new W({
            label: s.t(null, void 0, o(66707)),
            checkable: !0,
            id: "ToggleSessionBreaks",
            category: "settingsActions",
            disabled: !0,
            checked: !1,
            onExecute: () => {
              V && e.model().setProperty(V, !V.value(), Ve);
            },
            optionsLoader: async () => {
              const e = await D.promise();
              return (
                (V = e
                  .properties()
                  .childs()
                  .graphics.childs()
                  .vertlines.childs()
                  .sessBreaks.childs().visible),
                { checked: V.value(), disabled: F.value() }
              );
            },
            onDestroy: () => F.destroy(),
          });
        if (
          (F.subscribe(() => B.update({ disabled: F.value() })),
          v.push(B),
          v.push(
            new W({
              label: s.t(null, void 0, o(31789)),
              icon: o(39267),
              id: "ResetChart",
              category: "functionActions",
              onExecute: () => e.GUIResetScales(),
              shortcutHint: (0, h.humanReadableHash)(h.Modifiers.Alt + 82),
            }),
          ),
          v.push(
            new W({
              icon: o(93544),
              label: s.t(null, void 0, o(99984)),
              id: "RemoveAllIndicators",
              category: "functionActions",
              onExecute: () => e.removeAllStudies(),
            }),
          ),
          v.push(
            new W({
              icon: o(93544),
              label: s.t(null, void 0, o(96374)),
              id: "RemoveAllDrawingTools",
              category: "functionActions",
              onExecute: () => e.removeAllDrawingTools(),
            }),
          ),
          v.push(
            new W({
              icon: o(93544),
              label: s.t(null, void 0, o(4474)),
              id: "RemoveAllIndicatorsAndDrawingTools",
              category: "functionActions",
              onExecute: () => e.removeAllStudiesDrawingTools(),
            }),
          ),
          v.push(
            new W({
              label: s.t(null, void 0, o(22437)),
              id: "ApplyIndicatorsToAllCharts",
              category: "functionActions",
              disabled: !e.applyIndicatorsToAllChartsAvailable(),
              onExecute: () => {
                e.chartWidgetCollection().applyIndicatorsToAllCharts(e);
              },
            }),
          ),
          O.enabled("header_widget") &&
            O.enabled("header_undo_redo") &&
            (v.push(
              new W({
                id: "Undo",
                category: "functionActions",
                icon: o(77665),
                label: s.t(null, void 0, o(14804)),
                onExecute: () => {
                  e.model().undoHistory().undo();
                },
                disabled: e.model().undoHistory().undoStack().isEmpty(),
                shortcutHint: (0, h.humanReadableHash)(h.Modifiers.Mod + 90),
              }),
            ),
            v.push(
              new W({
                id: "Redo",
                category: "functionActions",
                icon: o(96052),
                label: s.t(null, void 0, o(48236)),
                onExecute: () => {
                  e.model().undoHistory().redo();
                },
                disabled: e.model().undoHistory().redoStack().isEmpty(),
                shortcutHint: (0, h.humanReadableHash)(h.Modifiers.Mod + 89),
              }),
            )),
          v.push(
            new W({
              label: s.t(null, void 0, o(12754)),
              id: "MoveChartRight",
              category: "functionActions",
              disabled: !e.chartWidgetCollection().activeChartCanBeMoved(),
              onExecute: () => {
                e.chartWidgetCollection().moveActiveChartWithUndo(!1);
              },
            }),
          ),
          v.push(
            new W({
              label: s.t(null, void 0, o(35112)),
              id: "MoveChartLeft",
              category: "functionActions",
              disabled: !e.chartWidgetCollection().activeChartCanBeMoved(),
              onExecute: () => {
                e.chartWidgetCollection().moveActiveChartWithUndo(!0);
              },
            }),
          ),
          O.enabled("header_widget") && O.enabled("header_chart_type"))
        ) {
          const t = (0, j.allChartStyles)();
          for (const o of t)
            v.push(
              new W({
                id: `ChartStyle_${o}`,
                category: "functionActions",
                disabled: !(null ===
                  (d = I.linking.supportedChartStyles.value()) || void 0 === d
                  ? void 0
                  : d.includes(o)),
                onExecute: () => {
                  e.chartWidgetCollection().setChartStyleToWidget(o);
                },
                icon: Q.SERIES_ICONS[o],
                label: Ie[o],
              }),
            );
        }
        return (
          O.enabled("header_widget") &&
            (0, ye.shouldShowFullscreen)() &&
            v.push(
              new W({
                label: s.t(null, void 0, o(67092)),
                id: "Fullscreen mode",
                icon: o(49697),
                category: "functionActions",
                checkable: !0,
                checked: e.chartWidgetCollection().fullscreen().value(),
                disabled: !e.chartWidgetCollection().fullscreenable().value(),
                onExecute: () => {
                  const t = e.chartWidgetCollection();
                  t.fullscreen().value()
                    ? t.exitFullscreen()
                    : t.startFullscreen();
                },
                shortcutHint: (0, h.humanReadableHash)(h.Modifiers.Shift + 70),
              }),
            ),
          v
        );
      }
      o(50151);
      var Ze = o(26744),
        Oe = o(2627),
        Be = o(59511);
      function We() {
        return Be.lineToolsFlat.map((e) =>
          (function (e) {
            var t;
            const l = Oe.lineToolsInfo[e],
              n =
                null === (t = l.selectHotkey) || void 0 === t ? void 0 : t.hash,
              i = {
                id: e,
                category: "drawingsActions",
                label: l.localizedName,
                icon: l.icon,
                shortcutHint: n ? (0, h.humanReadableHash)(n) : void 0,
                payload: e,
                onExecute: () => ee.tool.setValue(e),
                favourite: Ze.LinetoolsFavoritesStore.isFavorite(e),
                onFavouriteClick: (t) => {
                  t.preventDefault(),
                    Ze.LinetoolsFavoritesStore.isFavorite(e)
                      ? Ze.LinetoolsFavoritesStore.removeFavorite(e)
                      : Ze.LinetoolsFavoritesStore.addFavorite(e);
                },
              };
            return (
              e.toLowerCase().includes("fib") &&
                (i.aliases = [s.t(null, void 0, o(26578))]),
              new W(i)
            );
          })(e.name),
        );
      }
      var Ne = o(37404);
      o(3343);
      function Ke(e, t) {
        const o = e.getState().category,
          l = t.getState().category;
        return o === l
          ? 0
          : "drawingsActions" === l
            ? 1
            : "drawingsActions" === o || "functionActions" === o
              ? -1
              : 1;
      }
      var Ge = o(16216),
        Ue = o(28124);
      class qe extends i.DialogRenderer {
        constructor(e) {
          super(),
            (this._actions = []),
            (this.show = (e) => {
              this.visible().value() ||
                (async function (e, t) {
                  const l = [],
                    [n, i, a, r, c] = await Promise.all([
                      Fe(e),
                      Promise.resolve(null),
                      Promise.resolve(null),
                      Promise.resolve(null),
                      Promise.resolve(null),
                    ]);
                  l.push(...n);
                  const d = e.chartWidgetCollection();
                  if (
                    O.enabled("header_widget") &&
                    O.enabled("header_resolutions")
                  ) {
                    const t = {
                      label: (0, Z.appendEllipsis)(s.t(null, void 0, o(2569))),
                      id: "ChangeInterval",
                      category: "functionActions",
                      onExecute: () => {
                        (0, F.showChangeIntervalDialogAsync)({
                          initVal: I.linking.interval.value(),
                          selectOnInit: !0,
                        });
                      },
                    };
                    !O.enabled("show_interval_dialog_on_key_press") ||
                      e.readOnly() ||
                      e.options().hideSymbolSearch ||
                      (t.shortcutHint = (0, h.humanReadableHash)(188)),
                      l.push(new W(t));
                  }
                  if (
                    t &&
                    O.enabled("header_widget") &&
                    O.enabled("header_saveload")
                  ) {
                    l.push(
                      new W({
                        id: "LoadChartLayout",
                        category: "functionActions",
                        label: (0, Z.appendEllipsis)(s.t(null, void 0, o(564))),
                        onExecute: () => {
                          t.showLoadDialog();
                        },
                        shortcutHint: s.t(
                          null,
                          { context: "hotkey" },
                          o(23821),
                        ),
                      }),
                    );
                    const n = e.getSaveChartService();
                    n &&
                      (l.push(
                        new W({
                          id: "RenameChartLayout",
                          category: "functionActions",
                          label: (0, Z.appendEllipsis)(
                            s.t(null, void 0, o(38206)),
                          ),
                          onExecute: () => {
                            n.renameChart();
                          },
                        }),
                      ),
                      l.push(
                        new W({
                          id: "SaveChartLayout",
                          category: "functionActions",
                          icon: o(53707),
                          label: (0, Z.appendEllipsis)(
                            s.t(null, void 0, o(41569)),
                          ),
                          disabled: !n.hasChanges(),
                          onExecute: () => {
                            n.saveChartOrShowTitleDialog();
                          },
                          shortcutHint: (0, h.humanReadableHash)(
                            h.Modifiers.Mod + 83,
                          ),
                        }),
                      ));
                  }
                  return (
                    l.push(
                      new W({
                        id: "TakeSnapshot",
                        category: "functionActions",
                        icon: o(72644),
                        label: s.t(null, void 0, o(8270)),
                        onExecute: () => d.takeServerScreenshot(),
                        shortcutHint: (0, h.humanReadableHash)(
                          h.Modifiers.Alt + 83,
                        ),
                      }),
                    ),
                    l
                  );
                })(this._activeChartWidget, this._loadChartService).then(
                  (t) => {
                    (this._actions = t
                      .concat(
                        (() => {
                          const e = new W({
                            id: "ManageLayoutDrawings",
                            category: "functionActions",
                            icon: o(81111),
                            label: (0, Z.appendEllipsis)(
                              s.t(null, void 0, o(81031)),
                            ),
                            onExecute: () => (0, Ne.showManageDrawingsDialog)(),
                          });
                          return O.enabled("left_toolbar") ? [...We(), e] : [];
                        })(),
                      )
                      .sort(Ke)),
                      (this._rootInstance = (0, Ue.createReactRoot)(
                        l.createElement(D, {
                          shouldReturnFocus:
                            null == e ? void 0 : e.shouldReturnFocus,
                          dialogId: "globalSearch",
                          items: this._actions,
                          onClose: this.hide,
                        }),
                        this._container,
                      )),
                      this._setVisibility(!0);
                  },
                );
            }),
            (this.hide = () => {
              var e;
              null === (e = this._rootInstance) || void 0 === e || e.unmount(),
                this._setVisibility(!1);
              for (const e of this._actions) e.destroy();
            });
          const t = (0, Ge.service)(n.CHART_WIDGET_COLLECTION_SERVICE);
          (this._activeChartWidget = t.activeChartWidget.value()),
            (this._loadChartService = e);
        }
      }
    },
    63651: (e, t, o) => {
      "use strict";
      o.d(t, { useKeyboardNavigation: () => i });
      var l = o(50959),
        n = o(68335);
      function i(e, t, o, i = "keydown") {
        const [a, s] = (0, l.useState)(-1);
        return (
          (0, l.useEffect)(() => {
            if (!e) return;
            const o = (e) => {
              switch ((0, n.hashFromEvent)(e)) {
                case 40:
                  if (a === t.length - 1) break;
                  e.preventDefault(), s(a + 1);
                  break;
                case 38:
                  if (a <= 0) break;
                  e.preventDefault(), s(a - 1);
                  break;
              }
            };
            return (
              e.addEventListener("keydown", o),
              () => {
                e.removeEventListener("keydown", o);
              }
            );
          }, [e, a, t]),
          (0, l.useEffect)(() => {
            if (!e || !o) return;
            const l = (e) => {
              var l;
              e.repeat ||
                (13 === (0, n.hashFromEvent)(e) &&
                  o(null !== (l = t[a]) && void 0 !== l ? l : null, e));
            };
            return (
              e.addEventListener(i, l),
              () => {
                e.removeEventListener(i, l);
              }
            );
          }, [e, a, t, o, i]),
          { activeIdx: a, setActiveIdx: s }
        );
      }
    },
    32470: (e, t, o) => {
      "use strict";
      o.d(t, { useResetActiveIdx: () => n });
      var l = o(50959);
      function n(e, t = []) {
        (0, l.useEffect)(() => {
          e(-1);
        }, [...t]);
      }
    },
    98715: (e, t, o) => {
      "use strict";
      o.d(t, { useScrollToRef: () => n });
      var l = o(50959);
      function n(e, t) {
        (0, l.useEffect)(() => {
          var o;
          t >= 0 &&
            (null === (o = e.current) ||
              void 0 === o ||
              o.scrollIntoView({ block: "nearest" }));
        }, [t]);
      }
    },
    37404: (e, t, o) => {
      "use strict";
      o.d(t, { showManageDrawingsDialog: () => n });
      let l = null;
      function n(e) {
        return Promise.all([
          o.e(4166),
          o.e(8316),
          o.e(6220),
          o.e(291),
          o.e(1702),
        ])
          .then(o.bind(o, 41662))
          .then((t) => {
            const o = new (0, t.ManageDrawingsDialogRenderer)(e);
            return null !== l && l.hide(), o.show(), (l = o), o;
          });
      }
    },
    51826: (e, t, o) => {
      "use strict";
      o.d(t, { DialogsOpenerManager: () => l, dialogsOpenerManager: () => n });
      class l {
        constructor() {
          this._storage = new Map();
        }
        setAsOpened(e, t) {
          this._storage.set(e, t);
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
      const n = new l();
    },
    90692: (e, t, o) => {
      "use strict";
      o.d(t, { MatchMedia: () => n });
      var l = o(50959);
      class n extends l.PureComponent {
        constructor(e) {
          super(e),
            (this._handleChange = () => {
              this.forceUpdate();
            }),
            (this.state = { query: window.matchMedia(this.props.rule) });
        }
        componentDidMount() {
          this._subscribe(this.state.query);
        }
        componentDidUpdate(e, t) {
          this.state.query !== t.query &&
            (this._unsubscribe(t.query), this._subscribe(this.state.query));
        }
        componentWillUnmount() {
          this._unsubscribe(this.state.query);
        }
        render() {
          return this.props.children(this.state.query.matches);
        }
        static getDerivedStateFromProps(e, t) {
          return e.rule !== t.query.media
            ? { query: window.matchMedia(e.rule) }
            : null;
        }
        _subscribe(e) {
          e.addEventListener("change", this._handleChange);
        }
        _unsubscribe(e) {
          e.removeEventListener("change", this._handleChange);
        }
      }
    },
    64706: (e, t, o) => {
      "use strict";
      o.d(t, { MenuContext: () => l });
      const l = o(50959).createContext(null);
    },
    27317: (e, t, o) => {
      "use strict";
      o.d(t, { DEFAULT_MENU_THEME: () => p, Menu: () => f });
      var l = o(50959),
        n = o(97754),
        i = o.n(n),
        a = o(50151),
        s = o(9859),
        r = o(14729),
        h = o(50655),
        c = o(59064),
        d = o(67961),
        v = o(4741),
        u = o(83021),
        g = o(64706),
        m = o(79081);
      const p = m;
      var w;
      !(function (e) {
        e[(e.IndentFromWindow = 0)] = "IndentFromWindow";
      })(w || (w = {}));
      class f extends l.PureComponent {
        constructor(e) {
          super(e),
            (this._containerRef = null),
            (this._scrollWrapRef = null),
            (this._raf = null),
            (this._scrollRaf = null),
            (this._scrollTimeout = void 0),
            (this._manager = new d.OverlapManager()),
            (this._hotkeys = null),
            (this._scroll = 0),
            (this._handleContainerRef = (e) => {
              (this._containerRef = e),
                this.props.reference &&
                  ("function" == typeof this.props.reference &&
                    this.props.reference(e),
                  "object" == typeof this.props.reference &&
                    (this.props.reference.current = e));
            }),
            (this._handleScrollWrapRef = (e) => {
              (this._scrollWrapRef = e),
                "function" == typeof this.props.scrollWrapReference &&
                  this.props.scrollWrapReference(e),
                "object" == typeof this.props.scrollWrapReference &&
                  (this.props.scrollWrapReference.current = e);
            }),
            (this._handleCustomRemeasureDelegate = () => {
              this._resizeForced(), this._handleMeasure();
            }),
            (this._handleMeasure = ({
              callback: e,
              forceRecalcPosition: t,
            } = {}) => {
              var o, l, n, i, r, h, c, d, v, u, g, m;
              if (this.state.isMeasureValid && !t) return;
              const { position: p } = this.props,
                w = (0, a.ensureNotNull)(this._containerRef);
              let f = w.getBoundingClientRect();
              const b = document.documentElement.clientHeight,
                y = document.documentElement.clientWidth,
                S =
                  null !== (o = this.props.closeOnScrollOutsideOffset) &&
                  void 0 !== o
                    ? o
                    : 0;
              let T = b - 0 - S;
              const L = f.height > T;
              if (L) {
                ((0, a.ensureNotNull)(this._scrollWrapRef).style.overflowY =
                  "scroll"),
                  (f = w.getBoundingClientRect());
              }
              const { width: x, height: M } = f,
                C =
                  "function" == typeof p
                    ? p({
                        contentWidth: x,
                        contentHeight: M,
                        availableWidth: y,
                        availableHeight: b,
                      })
                    : p,
                A =
                  null !==
                    (n =
                      null === (l = null == C ? void 0 : C.indentFromWindow) ||
                      void 0 === l
                        ? void 0
                        : l.left) && void 0 !== n
                    ? n
                    : 0,
                z =
                  y -
                  (null !== (i = C.overrideWidth) && void 0 !== i ? i : x) -
                  (null !==
                    (h =
                      null === (r = null == C ? void 0 : C.indentFromWindow) ||
                      void 0 === r
                        ? void 0
                        : r.right) && void 0 !== h
                    ? h
                    : 0),
                k = (0, s.clamp)(C.x, A, Math.max(A, z)),
                E =
                  (null !==
                    (d =
                      null === (c = null == C ? void 0 : C.indentFromWindow) ||
                      void 0 === c
                        ? void 0
                        : c.top) && void 0 !== d
                    ? d
                    : 0) + S,
                _ =
                  b -
                  (null !== (v = C.overrideHeight) && void 0 !== v ? v : M) -
                  (null !==
                    (g =
                      null === (u = null == C ? void 0 : C.indentFromWindow) ||
                      void 0 === u
                        ? void 0
                        : u.bottom) && void 0 !== g
                    ? g
                    : 0);
              let H = (0, s.clamp)(C.y, E, Math.max(E, _));
              if (
                (C.forbidCorrectYCoord &&
                  H < C.y &&
                  ((T -= C.y - H), (H = C.y)),
                t &&
                  void 0 !== this.props.closeOnScrollOutsideOffset &&
                  C.y <= this.props.closeOnScrollOutsideOffset)
              )
                return void this._handleGlobalClose(!0);
              const P =
                null !== (m = C.overrideHeight) && void 0 !== m
                  ? m
                  : L
                    ? T
                    : void 0;
              this.setState(
                {
                  appearingMenuHeight: t ? this.state.appearingMenuHeight : P,
                  appearingMenuWidth: t
                    ? this.state.appearingMenuWidth
                    : C.overrideWidth,
                  appearingPosition: { x: k, y: H },
                  isMeasureValid: !0,
                },
                () => {
                  this.props.doNotRestorePosition ||
                    this._restoreScrollPosition(),
                    e && e();
                },
              );
            }),
            (this._restoreScrollPosition = () => {
              const e = document.activeElement,
                t = (0, a.ensureNotNull)(this._containerRef);
              if (null !== e && t.contains(e))
                try {
                  e.scrollIntoView();
                } catch (e) {}
              else
                (0, a.ensureNotNull)(this._scrollWrapRef).scrollTop =
                  this._scroll;
            }),
            (this._resizeForced = () => {
              this.setState({
                appearingMenuHeight: void 0,
                appearingMenuWidth: void 0,
                appearingPosition: void 0,
                isMeasureValid: void 0,
              });
            }),
            (this._resize = () => {
              null === this._raf &&
                (this._raf = requestAnimationFrame(() => {
                  this.setState({
                    appearingMenuHeight: void 0,
                    appearingMenuWidth: void 0,
                    appearingPosition: void 0,
                    isMeasureValid: void 0,
                  }),
                    (this._raf = null);
                }));
            }),
            (this._handleGlobalClose = (e) => {
              this.props.onClose(e);
            }),
            (this._handleSlot = (e) => {
              this._manager.setContainer(e);
            }),
            (this._handleScroll = () => {
              this._scroll = (0, a.ensureNotNull)(
                this._scrollWrapRef,
              ).scrollTop;
            }),
            (this._handleScrollOutsideEnd = () => {
              clearTimeout(this._scrollTimeout),
                (this._scrollTimeout = setTimeout(() => {
                  this._handleMeasure({ forceRecalcPosition: !0 });
                }, 80));
            }),
            (this._handleScrollOutside = (e) => {
              e.target !== this._scrollWrapRef &&
                (this._handleScrollOutsideEnd(),
                null === this._scrollRaf &&
                  (this._scrollRaf = requestAnimationFrame(() => {
                    this._handleMeasure({ forceRecalcPosition: !0 }),
                      (this._scrollRaf = null);
                  })));
            }),
            (this.state = {});
        }
        componentDidMount() {
          this._handleMeasure({ callback: this.props.onOpen });
          const {
            customCloseDelegate: e = c.globalCloseDelegate,
            customRemeasureDelegate: t,
          } = this.props;
          e.subscribe(this, this._handleGlobalClose),
            null == t || t.subscribe(null, this._handleCustomRemeasureDelegate),
            window.addEventListener("resize", this._resize);
          const o = null !== this.context;
          this._hotkeys ||
            o ||
            ((this._hotkeys = v.createGroup({ desc: "Popup menu" })),
            this._hotkeys.add({
              desc: "Close",
              hotkey: 27,
              handler: () => {
                this.props.onKeyboardClose && this.props.onKeyboardClose(),
                  this._handleGlobalClose();
              },
            })),
            this.props.repositionOnScroll &&
              window.addEventListener("scroll", this._handleScrollOutside, {
                capture: !0,
              });
        }
        componentDidUpdate() {
          this._handleMeasure();
        }
        componentWillUnmount() {
          const {
            customCloseDelegate: e = c.globalCloseDelegate,
            customRemeasureDelegate: t,
          } = this.props;
          e.unsubscribe(this, this._handleGlobalClose),
            null == t ||
              t.unsubscribe(null, this._handleCustomRemeasureDelegate),
            window.removeEventListener("resize", this._resize),
            window.removeEventListener("scroll", this._handleScrollOutside, {
              capture: !0,
            }),
            this._hotkeys && (this._hotkeys.destroy(), (this._hotkeys = null)),
            null !== this._raf &&
              (cancelAnimationFrame(this._raf), (this._raf = null)),
            null !== this._scrollRaf &&
              (cancelAnimationFrame(this._scrollRaf), (this._scrollRaf = null)),
            this._scrollTimeout && clearTimeout(this._scrollTimeout);
        }
        render() {
          const {
              id: e,
              role: t,
              "aria-label": o,
              "aria-labelledby": n,
              "aria-activedescendant": a,
              "aria-hidden": s,
              "aria-describedby": c,
              "aria-invalid": d,
              children: v,
              minWidth: p,
              theme: w = m,
              className: f,
              maxHeight: y,
              onMouseOver: S,
              onMouseOut: T,
              onKeyDown: L,
              onFocus: x,
              onBlur: M,
            } = this.props,
            {
              appearingMenuHeight: C,
              appearingMenuWidth: A,
              appearingPosition: z,
              isMeasureValid: k,
            } = this.state,
            E = {
              "--ui-kit-menu-max-width": `${z && z.x}px`,
              maxWidth: "calc(100vw - var(--ui-kit-menu-max-width) - 6px)",
            };
          return l.createElement(
            g.MenuContext.Provider,
            { value: this },
            l.createElement(
              u.SubmenuHandler,
              null,
              l.createElement(
                h.SlotContext.Provider,
                { value: this._manager },
                l.createElement(
                  "div",
                  {
                    id: e,
                    role: t,
                    "aria-label": o,
                    "aria-labelledby": n,
                    "aria-activedescendant": a,
                    "aria-hidden": s,
                    "aria-describedby": c,
                    "aria-invalid": d,
                    className: i()(f, w.menuWrap, !k && w.isMeasuring),
                    style: {
                      height: C,
                      left: z && z.x,
                      minWidth: p,
                      position: "fixed",
                      top: z && z.y,
                      width: A,
                      ...(this.props.limitMaxWidth && E),
                    },
                    "data-name": this.props["data-name"],
                    ref: this._handleContainerRef,
                    onScrollCapture: this.props.onScroll,
                    onContextMenu: r.preventDefaultForContextMenu,
                    tabIndex: this.props.tabIndex,
                    onMouseOver: S,
                    onMouseOut: T,
                    onKeyDown: L,
                    onFocus: x,
                    onBlur: M,
                  },
                  l.createElement(
                    "div",
                    {
                      className: i()(
                        w.scrollWrap,
                        !this.props.noMomentumBasedScroll && w.momentumBased,
                      ),
                      style: {
                        overflowY: void 0 !== C ? "scroll" : "auto",
                        maxHeight: y,
                      },
                      onScrollCapture: this._handleScroll,
                      ref: this._handleScrollWrapRef,
                    },
                    l.createElement(b, { className: w.menuBox }, v),
                  ),
                ),
              ),
              l.createElement(h.Slot, { reference: this._handleSlot }),
            ),
          );
        }
        update(e) {
          e ? this._resizeForced() : this._resize();
        }
        focus(e) {
          var t;
          null === (t = this._containerRef) || void 0 === t || t.focus(e);
        }
        blur() {
          var e;
          null === (e = this._containerRef) || void 0 === e || e.blur();
        }
      }
      function b(e) {
        const t = (0, a.ensureNotNull)((0, l.useContext)(u.SubmenuContext)),
          o = l.useRef(null);
        return l.createElement(
          "div",
          {
            ref: o,
            className: e.className,
            onMouseOver: function (e) {
              if (
                !(
                  null !== t.current &&
                  e.target instanceof Node &&
                  ((l = e.target),
                  null === (n = o.current) || void 0 === n
                    ? void 0
                    : n.contains(l))
                )
              )
                return;
              var l, n;
              t.isSubmenuNode(e.target) || t.setCurrent(null);
            },
            "data-name": "menu-inner",
          },
          e.children,
        );
      }
      f.contextType = u.SubmenuContext;
    },
    29197: (e, t, o) => {
      "use strict";
      o.d(t, { CloseDelegateContext: () => i });
      var l = o(50959),
        n = o(59064);
      const i = l.createContext(n.globalCloseDelegate);
    },
    20520: (e, t, o) => {
      "use strict";
      o.d(t, { PopupMenu: () => v });
      var l = o(50959),
        n = o(32227),
        i = o(62942),
        a = o(42842),
        s = o(27317),
        r = o(29197);
      const h = l.createContext(void 0);
      var c = o(36383);
      const d = l.createContext({ setMenuMaxWidth: !1 });
      function v(e) {
        const {
            controller: t,
            children: o,
            isOpened: v,
            closeOnClickOutside: u = !0,
            doNotCloseOn: g,
            onClickOutside: m,
            onClose: p,
            onKeyboardClose: w,
            "data-name": f = "popup-menu-container",
            ...b
          } = e,
          y = (0, l.useContext)(r.CloseDelegateContext),
          S = l.useContext(d),
          T = (0, l.useContext)(h),
          L = (0, c.useOutsideEvent)({
            handler: function (e) {
              m && m(e);
              if (!u) return;
              const t = (0, i.default)(g) ? g() : null == g ? [] : [g];
              if (t.length > 0 && e.target instanceof Node)
                for (const o of t) {
                  const t = n.findDOMNode(o);
                  if (t instanceof Node && t.contains(e.target)) return;
                }
              p();
            },
            mouseDown: !0,
            touchStart: !0,
          });
        return v
          ? l.createElement(
              a.Portal,
              {
                top: "0",
                left: "0",
                right: "0",
                bottom: "0",
                pointerEvents: "none",
              },
              l.createElement(
                "span",
                { ref: L, style: { pointerEvents: "auto" } },
                l.createElement(
                  s.Menu,
                  {
                    ...b,
                    onClose: p,
                    onKeyboardClose: w,
                    onScroll: function (t) {
                      const { onScroll: o } = e;
                      o && o(t);
                    },
                    customCloseDelegate: y,
                    customRemeasureDelegate: T,
                    ref: t,
                    "data-name": f,
                    limitMaxWidth: S.setMenuMaxWidth,
                  },
                  o,
                ),
              ),
            )
          : null;
      }
    },
    50655: (e, t, o) => {
      "use strict";
      o.d(t, { Slot: () => l.Slot, SlotContext: () => l.SlotContext });
      var l = o(99663);
    },
    40173: (e, t, o) => {
      "use strict";
      function l(e, t, o = {}) {
        return Object.assign(
          {},
          e,
          (function (e, t, o = {}) {
            const l = Object.assign({}, t);
            for (const n of Object.keys(t)) {
              const i = o[n] || n;
              i in e && (l[n] = [e[i], t[n]].join(" "));
            }
            return l;
          })(e, t, o),
        );
      }
      o.d(t, { mergeThemes: () => l });
    },
    84243: (e, t, o) => {
      "use strict";
      o.d(t, { drawingToolsIcons: () => l });
      const l = {
        SyncDrawing: o(99088),
        arrow: o(63743),
        cursor: o(18953),
        dot: o(72196),
        performance: "",
        drawginmode: o(52459),
        drawginmodeActive: o(63975),
        eraser: o(27999),
        group: o(34059),
        hideAllDrawings: o(45820),
        hideAllDrawingsActive: o(84959),
        hideAllIndicators: o(42321),
        hideAllIndicatorsActive: o(75895),
        hideAllDrawingTools: o(93756),
        hideAllDrawingToolsActive: o(42650),
        hideAllPositionsTools: o(57313),
        hideAllPositionsToolsActive: o(65162),
        lockAllDrawings: o(91244),
        lockAllDrawingsActive: o(65186),
        magnet: o(68385),
        heart: o(10862),
        smile: o(7636),
        sticker: o(62567),
        strongMagnet: o(46049),
        measure: o(88518),
        removeAllDrawingTools: o(93544),
        showObjectsTree: o(36515),
        zoom: o(6894),
        "zoom-out": o(45360),
      };
    },
    59511: (e, t, o) => {
      "use strict";
      o.d(t, {
        isLineToolsGroupWithSections: () => a,
        lineTools: () => i,
        lineToolsFlat: () => s,
      });
      var l = o(11542),
        n = o(37265);
      const i = [
        {
          id: "linetool-group-cursors",
          title: l.t(null, void 0, o(81578)),
          items: [
            { name: "cursor" },
            { name: "dot" },
            { name: "arrow" },
            { name: "eraser" },
            null,
          ].filter(n.isExistent),
          trackLabel: null,
        },
        {
          id: "linetool-group-trend-line",
          title: l.t(null, void 0, o(48773)),
          sections: [
            {
              title: l.t(null, void 0, o(56982)),
              items: [
                { name: "LineToolTrendLine" },
                { name: "LineToolRay" },
                { name: "LineToolInfoLine" },
                { name: "LineToolExtended" },
                { name: "LineToolTrendAngle" },
                { name: "LineToolHorzLine" },
                { name: "LineToolHorzRay" },
                { name: "LineToolVertLine" },
                { name: "LineToolCrossLine" },
              ],
            },
            {
              title: l.t(null, void 0, o(59934)),
              items: [
                { name: "LineToolParallelChannel" },
                { name: "LineToolRegressionTrend" },
                { name: "LineToolFlatBottom" },
                { name: "LineToolDisjointAngle" },
              ],
            },
            {
              title: l.t(null, void 0, o(36167)),
              items: [
                { name: "LineToolPitchfork" },
                { name: "LineToolSchiffPitchfork2" },
                { name: "LineToolSchiffPitchfork" },
                { name: "LineToolInsidePitchfork" },
              ],
            },
          ],
          trackLabel: null,
        },
        {
          id: "linetool-group-gann-and-fibonacci",
          title: l.t(null, void 0, o(2654)),
          sections: [
            {
              title: l.t(null, void 0, o(26578)),
              items: [
                { name: "LineToolFibRetracement" },
                { name: "LineToolTrendBasedFibExtension" },
                { name: "LineToolFibChannel" },
                { name: "LineToolFibTimeZone" },
                { name: "LineToolFibSpeedResistanceFan" },
                { name: "LineToolTrendBasedFibTime" },
                { name: "LineToolFibCircles" },
                { name: "LineToolFibSpiral" },
                { name: "LineToolFibSpeedResistanceArcs" },
                { name: "LineToolFibWedge" },
                { name: "LineToolPitchfan" },
              ],
            },
            {
              title: l.t(null, void 0, o(51494)),
              items: [
                { name: "LineToolGannSquare" },
                { name: "LineToolGannFixed" },
                { name: "LineToolGannComplex" },
                { name: "LineToolGannFan" },
              ],
            },
          ],
          trackLabel: null,
        },
        {
          id: "linetool-group-patterns",
          title: l.t(null, void 0, o(46417)),
          sections: [
            {
              title: l.t(null, void 0, o(46417)),
              items: [
                { name: "LineTool5PointsPattern" },
                { name: "LineToolCypherPattern" },
                { name: "LineToolHeadAndShoulders" },
                { name: "LineToolABCD" },
                { name: "LineToolTrianglePattern" },
                { name: "LineToolThreeDrivers" },
              ],
            },
            {
              title: l.t(null, void 0, o(44255)),
              items: [
                { name: "LineToolElliottImpulse" },
                {
                  name: "LineToolElliottCorrection",
                },
                { name: "LineToolElliottTriangle" },
                { name: "LineToolElliottDoubleCombo" },
                { name: "LineToolElliottTripleCombo" },
              ],
            },
            {
              title: l.t(null, void 0, o(77915)),
              items: [
                { name: "LineToolCircleLines" },
                { name: "LineToolTimeCycles" },
                { name: "LineToolSineLine" },
              ],
            },
          ],
          trackLabel: null,
        },
        {
          id: "linetool-group-prediction-and-measurement",
          title: l.t(null, void 0, o(1410)),
          sections: [
            {
              title: l.t(null, void 0, o(75747)),
              items: [
                { name: "LineToolRiskRewardLong" },
                { name: "LineToolRiskRewardShort" },
                { name: "LineToolPrediction" },
                { name: "LineToolBarsPattern" },
                { name: "LineToolGhostFeed" },
                { name: "LineToolProjection" },
              ].filter(n.isExistent),
            },
            {
              title: l.t(null, void 0, o(69260)),
              items: [
                { name: "LineToolAnchoredVWAP" },
                { name: "LineToolFixedRangeVolumeProfile" },
                null,
              ].filter(n.isExistent),
            },
            {
              title: l.t(null, void 0, o(97050)),
              items: [
                { name: "LineToolPriceRange" },
                { name: "LineToolDateRange" },
                { name: "LineToolDateAndPriceRange" },
              ],
            },
          ],
          trackLabel: null,
        },
        {
          id: "linetool-group-geometric-shapes",
          title: l.t(null, void 0, o(22145)),
          sections: [
            {
              title: l.t(null, void 0, o(65695)),
              items: [
                { name: "LineToolBrush" },
                { name: "LineToolHighlighter" },
              ],
            },
            {
              title: l.t(null, void 0, o(19147)),
              items: [
                { name: "LineToolArrowMarker" },
                { name: "LineToolArrow" },
                { name: "LineToolArrowMarkUp" },
                { name: "LineToolArrowMarkDown" },
                { name: "LineToolArrowMarkLeft" },
                { name: "LineToolArrowMarkRight" },
              ].filter(n.isExistent),
            },
            {
              title: l.t(null, void 0, o(65781)),
              items: [
                { name: "LineToolRectangle" },
                { name: "LineToolRotatedRectangle" },
                { name: "LineToolPath" },
                { name: "LineToolCircle" },
                { name: "LineToolEllipse" },
                { name: "LineToolPolyline" },
                { name: "LineToolTriangle" },
                { name: "LineToolArc" },
                { name: "LineToolBezierQuadro" },
                { name: "LineToolBezierCubic" },
              ],
            },
          ],
          trackLabel: null,
        },
        {
          id: "linetool-group-annotation",
          title: l.t(null, void 0, o(32064)),
          sections: [
            {
              title: l.t(null, void 0, o(65831)),
              items: [
                { name: "LineToolText" },
                { name: "LineToolTextAbsolute" },
                { name: "LineToolNote" },
                { name: "LineToolNoteAbsolute" },
                { name: "LineToolCallout" },
                { name: "LineToolComment" },
                { name: "LineToolPriceLabel" },
                { name: "LineToolPriceNote" },
                { name: "LineToolSignpost" },
                { name: "LineToolFlagMark" },
              ],
            },
            {
              title: l.t(null, void 0, o(93111)),
              items: [null, null, null].filter(n.isExistent),
            },
          ],
          trackLabel: null,
        },
      ];
      function a(e) {
        return "sections" in e;
      }
      const s = i
        .map(function (e) {
          return a(e) ? e.sections.map((e) => e.items).flat() : e.items;
        })
        .flat();
    },
    27906: (e, t, o) => {
      "use strict";
      o.d(t, { shouldShowFullscreen: () => n });
      var l = o(56570);
      function n() {
        return l.enabled("header_fullscreen_button");
      }
    },
    2627: (e, t, o) => {
      "use strict";
      o.d(t, { lineToolsInfo: () => b });
      var l = o(50151),
        n = o(11542),
        i = o(61814),
        a = (o(21251), o(98626)),
        s = o(84243);
      const r = {
        SyncDrawing: n.t(null, void 0, o(59377)),
        arrow: n.t(null, void 0, o(11858)),
        cursor: n.t(null, void 0, o(6969)),
        dot: n.t(null, void 0, o(57157)),
        performance: n.t(null, void 0, o(35553)),
        drawginmode: n.t(null, void 0, o(62518)),
        eraser: n.t(null, void 0, o(8727)),
        group: n.t(null, void 0, o(3154)),
        hideAllDrawings: n.t(null, void 0, o(52563)),
        lockAllDrawings: n.t(null, void 0, o(79451)),
        magnet: n.t(null, void 0, o(81396)),
        measure: n.t(null, void 0, o(91563)),
        removeAllDrawingTools: n.t(null, void 0, o(57118)),
        showObjectsTree: n.t(null, void 0, o(85786)),
        zoom: n.t(null, void 0, o(55774)),
        "zoom-out": n.t(null, void 0, o(37310)),
      };
      var h = o(98523),
        c = o(68335),
        d = o(17402);
      const v = (0, c.humanReadableModifiers)(c.Modifiers.Shift, !1),
        u = (0, c.humanReadableModifiers)(c.Modifiers.Alt, !1),
        g = (0, c.humanReadableModifiers)(c.Modifiers.Mod, !1),
        m = { keys: [v], text: n.t(null, void 0, o(23369)) },
        p = { keys: [v], text: n.t(null, void 0, o(13798)) },
        w = { keys: [v], text: n.t(null, void 0, o(10539)) },
        f = {
          LineTool5PointsPattern: {},
          LineToolABCD: {},
          LineToolArc: {},
          LineToolArrow: {},
          LineToolArrowMarkDown: {},
          LineToolArrowMarkLeft: {},
          LineToolArrowMarkRight: {},
          LineToolArrowMarkUp: {},
          LineToolBalloon: {},
          LineToolComment: {},
          LineToolBarsPattern: {},
          LineToolBezierCubic: {},
          LineToolBezierQuadro: {},
          LineToolBrush: {},
          LineToolCallout: {},
          LineToolCircleLines: {},
          LineToolCypherPattern: {},
          LineToolDateAndPriceRange: {},
          LineToolDateRange: {},
          LineToolDisjointAngle: { hotKey: (0, i.hotKeySerialize)(m) },
          LineToolElliottCorrection: {},
          LineToolElliottDoubleCombo: {},
          LineToolElliottImpulse: {},
          LineToolElliottTriangle: {},
          LineToolElliottTripleCombo: {},
          LineToolEllipse: { hotKey: (0, i.hotKeySerialize)(p) },
          LineToolExtended: {},
          LineToolFibChannel: {},
          LineToolFibCircles: { hotKey: (0, i.hotKeySerialize)(p) },
          LineToolFibRetracement: {},
          LineToolFibSpeedResistanceArcs: {},
          LineToolFibSpeedResistanceFan: { hotKey: (0, i.hotKeySerialize)(w) },
          LineToolFibSpiral: {},
          LineToolFibTimeZone: {},
          LineToolFibWedge: {},
          LineToolFlagMark: {},
          LineToolFlatBottom: { hotKey: (0, i.hotKeySerialize)(m) },
          LineToolAnchoredVWAP: {},
          LineToolGannComplex: {},
          LineToolGannFixed: {},
          LineToolGannFan: {},
          LineToolGannSquare: {
            hotKey: (0, i.hotKeySerialize)({
              keys: [v],
              text: n.t(null, void 0, o(83042)),
            }),
          },
          LineToolHeadAndShoulders: {},
          LineToolHorzLine: {
            hotKey: (0, i.hotKeySerialize)({
              keys: [u, "H"],
              text: "{0} + {1}",
            }),
          },
          LineToolHorzRay: {},
          LineToolIcon: {},
          LineToolEmoji: {},
          LineToolInsidePitchfork: {},
          LineToolNote: {},
          LineToolNoteAbsolute: {},
          LineToolSignpost: {},
          LineToolParallelChannel: { hotKey: (0, i.hotKeySerialize)(m) },
          LineToolPitchfan: {},
          LineToolPitchfork: {},
          LineToolPolyline: {},
          LineToolPath: {},
          LineToolPrediction: {},
          LineToolPriceLabel: {},
          LineToolPriceNote: { hotKey: (0, i.hotKeySerialize)(m) },
          LineToolArrowMarker: {},
          LineToolPriceRange: {},
          LineToolProjection: {},
          LineToolRay: {},
          LineToolRectangle: {
            hotKey: (0, i.hotKeySerialize)({
              keys: [v],
              text: n.t(null, void 0, o(10539)),
            }),
          },
          LineToolCircle: {},
          LineToolRegressionTrend: {},
          LineToolRiskRewardLong: {},
          LineToolRiskRewardShort: {},
          LineToolFixedRangeVolumeProfile: {},
          LineToolRotatedRectangle: { hotKey: (0, i.hotKeySerialize)(m) },
          LineToolSchiffPitchfork: {},
          LineToolSchiffPitchfork2: {},
          LineToolSineLine: {},
          LineToolText: {},
          LineToolTextAbsolute: {},
          LineToolThreeDrivers: {},
          LineToolTimeCycles: {},
          LineToolTrendAngle: { hotKey: (0, i.hotKeySerialize)(m) },
          LineToolTrendBasedFibExtension: {},
          LineToolTrendBasedFibTime: {},
          LineToolTrendLine: { hotKey: (0, i.hotKeySerialize)(m) },
          LineToolInfoLine: {},
          LineToolTriangle: {},
          LineToolTrianglePattern: {},
          LineToolVertLine: {
            hotKey: (0, i.hotKeySerialize)({
              keys: [u, "V"],
              text: "{0} + {1}",
            }),
          },
          LineToolCrossLine: {},
          LineToolHighlighter: {},
          LineToolGhostFeed: {},
          SyncDrawing: { iconActive: s.drawingToolsIcons.SyncDrawingActive },
          arrow: {},
          cursor: {},
          dot: {},
          drawginmode: {
            iconActive: s.drawingToolsIcons.drawginmodeActive,
          },
          eraser: {},
          group: {},
          hideAllDrawings: {
            iconActive: s.drawingToolsIcons.hideAllDrawingsActive,
            hotKey: (0, i.hotKeySerialize)({
              keys: [g, u, "H"],
              text: "{0} + {1} + {2}",
            }),
          },
          lockAllDrawings: {
            iconActive: s.drawingToolsIcons.lockAllDrawingsActive,
          },
          magnet: {
            hotKey: (0, i.hotKeySerialize)({ keys: [g], text: "{0}" }),
          },
          measure: {
            hotKey: (0, i.hotKeySerialize)({
              keys: [v],
              text: n.t(null, void 0, o(92949)),
            }),
          },
          removeAllDrawingTools: {},
          showObjectsTree: {},
          zoom: {},
          "zoom-out": {},
        };
      const b = {};
      Object.entries(f)
        .map(([e, t]) => {
          var o, n;
          const i =
            null !== (o = a.lineToolsIcons[e]) && void 0 !== o
              ? o
              : s.drawingToolsIcons[e];
          (0, l.assert)(!!i, `Icon is not defined for drawing "${e}"`);
          const c =
            null !== (n = h.lineToolsLocalizedNames[e]) && void 0 !== n
              ? n
              : r[e];
          (0, l.assert)(
            !!c,
            `Localized name is not defined for drawing "${e}"`,
          );
          return {
            ...t,
            name: e,
            icon: i,
            localizedName: c,
            selectHotkey: d.lineToolsSelectHotkeys[e],
          };
        })
        .forEach((e) => {
          b[e.name] = e;
        });
    },
    23076: (e, t, o) => {
      "use strict";
      o.r(t), o.d(t, { SERIES_ICONS: () => m });
      var l = o(94670),
        n = o(32162),
        i = o(39956),
        a = o(14083),
        s = o(45504),
        r = o(52867),
        h = o(41473),
        c = o(31246),
        d = o(15726),
        v = o(24464),
        u = o(71705),
        g = o(9450);
      const m = {
        3: l,
        16: n,
        0: i,
        1: a,
        8: s,
        9: r,
        2: h,
        14: c,
        15: d,
        10: v,
        12: u,
        13: g,
      };
    },
    26744: (e, t, o) => {
      "use strict";
      o.d(t, { LinetoolsFavoritesStore: () => h });
      var l = o(52033),
        n = o(37265),
        i = o(56840);
      const a = ["LineToolBalloon", null, null].filter(n.isExistent),
        s = !1;
      var r, h;
      !(function (e) {
        function t() {
          var t, l;
          e.favorites = [];
          let r = !1;
          const h = Boolean(
              void 0 === (0, i.getValue)("chart.favoriteDrawings"),
            ),
            c = (0, i.getJSON)("chart.favoriteDrawings", []);
          if (0 === c.length && h && "undefined" != typeof window) {
            const e = JSON.parse(
              null !==
                (l =
                  null === (t = window.urlParams) || void 0 === t
                    ? void 0
                    : t.favorites) && void 0 !== l
                ? l
                : "{}",
            ).drawingTools;
            e && Array.isArray(e) && c.push(...e);
          }
          c.forEach((t, l) => {
            const n = t.tool || t;
            o(n)
              ? a.includes(n)
                ? (r = !0)
                : e.favorites.push(n)
              : s && s.includes(n) && e.hiddenToolsPositions.set(n, l);
          }),
            r && n(),
            e.favoritesSynced.fire();
        }
        function o(e) {
          return "string" == typeof e && "" !== e && !(s && s.includes(e));
        }
        function n(t) {
          const o = e.favorites.slice();
          e.hiddenToolsPositions.forEach((e, t) => {
            o.splice(e, 0, t);
          }),
            (0, i.setJSON)("chart.favoriteDrawings", o, t);
        }
        (e.favorites = []),
          (e.favoritesSynced = new l.Delegate()),
          (e.hiddenToolsPositions = new Map()),
          (e.favoriteIndex = function (t) {
            return e.favorites.indexOf(t);
          }),
          (e.isValidLineToolName = o),
          (e.saveFavorites = n),
          t(),
          i.onSync.subscribe(null, t);
      })(r || (r = {})),
        (function (e) {
          function t(e) {
            return r.isValidLineToolName(e);
          }
          function o() {
            return r.favorites.length;
          }
          function n(e) {
            return -1 !== r.favoriteIndex(e);
          }
          (e.favoriteAdded = new l.Delegate()),
            (e.favoriteRemoved = new l.Delegate()),
            (e.favoriteMoved = new l.Delegate()),
            (e.favoritesSynced = r.favoritesSynced),
            (e.favorites = function () {
              return r.favorites.slice();
            }),
            (e.isValidLineToolName = t),
            (e.favoritesCount = o),
            (e.favorite = function (e) {
              return e < 0 || e >= o() ? "" : r.favorites[e];
            }),
            (e.addFavorite = function (o, l) {
              return (
                !(n(o) || !t(o) || "performance" === o) &&
                (r.favorites.push(o),
                r.saveFavorites(l),
                e.favoriteAdded.fire(o),
                !0)
              );
            }),
            (e.removeFavorite = function (t, o) {
              const l = r.favoriteIndex(t);
              if (-1 === l) return !1;
              r.favorites.splice(l, 1);
              const n = r.hiddenToolsPositions;
              return (
                n.forEach((e, t) => {
                  e > l && n.set(t, e - 1);
                }),
                r.saveFavorites(o),
                e.favoriteRemoved.fire(t),
                !0
              );
            }),
            (e.isFavorite = n),
            (e.moveFavorite = function (l, n, i) {
              if (n < 0 || n >= o() || !t(l)) return !1;
              const a = r.favoriteIndex(l);
              if (-1 === a || n === a) return !1;
              const s = r.hiddenToolsPositions;
              return (
                s.forEach((e, t) => {
                  a < e && n > e ? e-- : n < e && a > e && e++, s.set(t, e);
                }),
                r.favorites.splice(a, 1),
                r.favorites.splice(n, 0, l),
                r.saveFavorites(i),
                e.favoriteMoved.fire(l, a, n),
                !0
              );
            });
        })(h || (h = {}));
    },
    52459: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M17.27 4.56a2.5 2.5 0 0 0-3.54 0l-.58.59-9 9-1 1-.15.14V20h4.7l.15-.15 1-1 9-9 .59-.58a2.5 2.5 0 0 0 0-3.54l-1.17-1.17Zm-2.83.7a1.5 1.5 0 0 1 2.12 0l1.17 1.18a1.5 1.5 0 0 1 0 2.12l-.23.23-3.3-3.29.24-.23Zm-.94.95 3.3 3.29-8.3 8.3-3.3-3.3 8.3-8.3Zm-9 9 3.3 3.29-.5.5H4v-3.3l.5-.5Zm16.5.29a1.5 1.5 0 0 0-3 0V18h4.5c.83 0 1.5.67 1.5 1.5v4c0 .83-.67 1.5-1.5 1.5h-6a1.5 1.5 0 0 1-1.5-1.5v-4c0-.83.67-1.5 1.5-1.5h.5v-2.5a2.5 2.5 0 0 1 5 0v.5h-1v-.5ZM16.5 19a.5.5 0 0 0-.5.5v4c0 .28.22.5.5.5h6a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 0-.5-.5h-6Zm2.5 4v-2h1v2h-1Z"/></svg>';
    },
    63975: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M17.27 4.56a2.5 2.5 0 0 0-3.54 0l-.58.59-9 9-1 1-.15.14V20h4.7l.15-.15 1-1 9-9 .59-.58a2.5 2.5 0 0 0 0-3.54l-1.17-1.17Zm-2.83.7a1.5 1.5 0 0 1 2.12 0l1.17 1.18a1.5 1.5 0 0 1 0 2.12l-.23.23-3.3-3.29.24-.23Zm-.94.95 3.3 3.29-8.3 8.3-3.3-3.3 8.3-8.3Zm-9 9 3.3 3.29-.5.5H4v-3.3l.5-.5Zm16.5.29a1.5 1.5 0 0 0-3 0V18h3v-2.5Zm1 0V18h.5c.83 0 1.5.67 1.5 1.5v4c0 .83-.67 1.5-1.5 1.5h-6a1.5 1.5 0 0 1-1.5-1.5v-4c0-.83.67-1.5 1.5-1.5h.5v-2.5a2.5 2.5 0 0 1 5 0ZM16.5 19a.5.5 0 0 0-.5.5v4c0 .28.22.5.5.5h6a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 0-.5-.5h-6Zm2.5 4v-2h1v2h-1Z"/></svg>';
    },
    94670: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" fill-rule="evenodd" d="m25.35 5.35-9.5 9.5-.35.36-.35-.36-4.65-4.64-8.15 8.14-.7-.7 8.5-8.5.35-.36.35.36 4.65 4.64 9.15-9.14.7.7ZM2 21h1v1H2v-1Zm2-1H3v1h1v1h1v-1h1v1h1v-1h1v1h1v-1h1v1h1v-1h1v1h1v-1h1v1h1v-1h1v1h1v-1h1v1h1v-1h1v1h1v-1h1v1h1v-1h1v1h1v-1h-1v-1h1v-1h-1v-1h1v-1h-1v-1h1v-1h-1v-1h1v-1h-1v-1h1v-1h-1v-1h1V9h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v-1h-1v-1h-1v-1h-1v-1h-1v-1h-1v1H9v1H8v1H7v1H6v1H5v1H4v1Zm1 0v1H4v-1h1Zm1 0H5v-1h1v1Zm1 0v1H6v-1h1Zm0-1H6v-1h1v1Zm1 0H7v1h1v1h1v-1h1v1h1v-1h1v1h1v-1h1v1h1v-1h1v1h1v-1h1v1h1v-1h1v1h1v-1h1v1h1v-1h1v-1h-1v-1h1v-1h-1v-1h1v-1h-1v-1h1v-1h-1v-1h1v-1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v-1h-1v-1h-1v-1h-1v-1h-1v-1h-1v1H9v1H8v1H7v1h1v1Zm1 0v1H8v-1h1Zm0-1H8v-1h1v1Zm1 0H9v1h1v1h1v-1h1v1h1v-1h1v1h1v-1h-1v-1h-1v-1h-1v-1h-1v-1h-1v1H9v1h1v1Zm1 0v1h-1v-1h1Zm0-1v-1h-1v1h1Zm0 0v1h1v1h1v-1h-1v-1h-1Zm6 2v-1h1v1h-1Zm2 0v1h-1v-1h1Zm0-1h-1v-1h1v1Zm1 0h-1v1h1v1h1v-1h1v1h1v-1h-1v-1h1v-1h-1v-1h1v-1h-1v-1h1v-1h-1v1h-1v1h-1v1h-1v1h1v1Zm1 0h-1v1h1v-1Zm0-1h1v1h-1v-1Zm0-1h1v-1h-1v1Zm0 0v1h-1v-1h1Zm-4 3v1h-1v-1h1Z"/></svg>';
    },
    39956: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M19 6h-1v7h-3v1h3v8h1v-3h3v-1h-3V6ZM11 7h-1v13H7v1h3v2h1V10h3V9h-3V7Z"/></svg>';
    },
    24464: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="m10.49 7.55-.42.7-2.1 3.5.86.5 1.68-2.8 1.8 2.82.84-.54-2.23-3.5-.43-.68Zm12.32 4.72-.84-.54 2.61-4 .84.54-2.61 4Zm-5.3 6.3 1.2-1.84.84.54-1.63 2.5-.43.65-.41-.65-1.6-2.5.85-.54 1.17 1.85ZM4.96 16.75l.86.52-2.4 4-.86-.52 2.4-4ZM3 14v1h1v-1H3Zm2 0h1v1H5v-1Zm2 0v1h1v-1H7Zm2 0h1v1H9v-1Zm2 0v1h1v-1h-1Zm2 0h1v1h-1v-1Zm2 0v1h1v-1h-1Zm2 0h1v1h-1v-1Zm2 0v1h1v-1h-1Zm2 0h1v1h-1v-1Zm2 0v1h1v-1h-1Zm2 0h1v1h-1v-1Z"/></svg>';
    },
    14083: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="currentColor"><path d="M17 11v6h3v-6h-3zm-.5-1h4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-4a.5.5 0 0 1-.5-.5v-7a.5.5 0 0 1 .5-.5z"/><path d="M18 7h1v3.5h-1zm0 10.5h1V21h-1z"/><path d="M9 8v12h3V8H9zm-.5-1h4a.5.5 0 0 1 .5.5v13a.5.5 0 0 1-.5.5h-4a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 .5-.5z"/><path d="M10 4h1v3.5h-1zm0 16.5h1V24h-1z"/></svg>';
    },
    53707: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"><g fill="none"><path stroke="currentColor" d="M11 20.5H7.5a5 5 0 1 1 .42-9.98 7.5 7.5 0 0 1 14.57 2.1 4 4 0 0 1-1 7.877H18"/><path stroke="currentColor" d="M14.5 24V12.5M11 16l3.5-3.5L18 16"/></g></svg>';
    },
    9450: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" fill-rule="evenodd" d="M12 7v14h5V7h-5Zm4 1h-3v12h3V8ZM19 15v6h5v-6h-5Zm4 1h-3v4h3v-4ZM5 12h5v9H5v-9Zm1 1h3v7H6v-7Z"/></svg>';
    },
    1393: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M13.5 6a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17zM4 14.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z"/><path fill="currentColor" d="M9 14h4v-4h1v4h4v1h-4v4h-1v-4H9v-1z"/></svg>';
    },
    49697: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><g fill="currentColor"><path d="M21 7v4h1V6h-5v1z"/><path d="M16.854 11.854l5-5-.708-.708-5 5zM7 7v4H6V6h5v1z"/><path d="M11.146 11.854l-5-5 .708-.708 5 5zM21 21v-4h1v5h-5v-1z"/><path d="M16.854 16.146l5 5-.708.708-5-5z"/><g><path d="M7 21v-4H6v5h5v-1z"/><path d="M11.146 16.146l-5 5 .708.708 5-5z"/></g></g></svg>';
    },
    34059: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="30" height="30"><path fill="currentColor" d="M5.5 13A2.5 2.5 0 0 0 3 15.5 2.5 2.5 0 0 0 5.5 18 2.5 2.5 0 0 0 8 15.5 2.5 2.5 0 0 0 5.5 13zm9.5 0a2.5 2.5 0 0 0-2.5 2.5A2.5 2.5 0 0 0 15 18a2.5 2.5 0 0 0 2.5-2.5A2.5 2.5 0 0 0 15 13zm9.5 0a2.5 2.5 0 0 0-2.5 2.5 2.5 2.5 0 0 0 2.5 2.5 2.5 2.5 0 0 0 2.5-2.5 2.5 2.5 0 0 0-2.5-2.5z"/></svg>';
    },
    45504: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="currentColor"><path d="M9 8v12h3V8H9zm-1-.502C8 7.223 8.215 7 8.498 7h4.004c.275 0 .498.22.498.498v13.004a.493.493 0 0 1-.498.498H8.498A.496.496 0 0 1 8 20.502V7.498z"/><path d="M10 4h1v3.5h-1z"/><path d="M17 6v6h3V6h-3zm-1-.5c0-.276.215-.5.498-.5h4.004c.275 0 .498.23.498.5v7c0 .276-.215.5-.498.5h-4.004a.503.503 0 0 1-.498-.5v-7z"/><path d="M18 2h1v3.5h-1z"/></svg>';
    },
    71705: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M7.5 7H7v14h5V7H7.5zM8 20V8h3v12H8zm7.5-11H15v10h5V9h-4.5zm.5 9v-8h3v8h-3z"/></svg>';
    },
    32162: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="currentColor"><path fill-rule="evenodd" d="M22 3h1v1h-1V3Zm0 2V4h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1V9h-1V8h-1V7h-1V6h-1V5h-1v1H9v1H8v1H7v1H6v1H5v1H4v1h1v1H4v1h1v-1h1v-1h1v-1h1v-1h1V9h1V8h1v1h1v1h1v1h1v1h1v1h1v-1h1v-1h1v-1h1V9h1V8h1V7h1V6h1V5h-1Zm-1 1V5h1v1h-1Zm-1 1V6h1v1h-1Zm-1 1V7h1v1h-1Zm-1 1V8h1v1h-1Zm-1 1V9h1v1h-1Zm-1 1v-1h1v1h-1Zm-1 0v-1h-1V9h-1V8h-1V7h-1V6h-1v1H9v1H8v1H7v1H6v1H5v1h1v-1h1v-1h1V9h1V8h1V7h1v1h1v1h1v1h1v1h1Zm0 0h1v1h-1v-1Zm.84 6.37 7.5-7-.68-.74-7.15 6.67-4.66-4.65-.33-.34-.36.32-5.5 5 .68.74 5.14-4.68 4.67 4.66.34.35.35-.33ZM6 23H5v1h1v-1Zm0-1H5v-1h1v1Zm1 0v1H6v-1h1Zm0-1H6v-1h1v1Zm1 0v1H7v-1h1Zm0-1H7v-1h1v1Zm1 0v1H8v-1h1Zm0-1H8v-1h1v1Zm1 0v1H9v-1h1Zm0-1H9v-1h1v1Zm1 0h-1v1h1v1h1v1h1v1h1v1h1v1h1v-1h1v-1h1v-1h1v-1h1v-1h1v-1h1v-1h1v-1h1v-1h-1v-1h1v-1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v-1h-1v-1h-1v-1h-1v-1h-1v-1h-1v1h1v1Zm0 0h1v1h-1v-1Zm2 2v1h1v1h1v1h1v-1h1v-1h1v-1h1v-1h1v-1h1v-1h1v-1h1v-1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v-1h-1v-1h-1Zm0 0v-1h-1v1h1Z"/></svg>';
    },
    52867: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="currentColor"><path d="M17 11v6h3v-6h-3zm-.5-1h4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-4a.5.5 0 0 1-.5-.5v-7a.5.5 0 0 1 .5-.5z"/><path d="M18 7h1v3.5h-1zm0 10.5h1V21h-1z"/><path d="M9 8v11h3V8H9zm-.5-1h4a.5.5 0 0 1 .5.5v12a.5.5 0 0 1-.5.5h-4a.5.5 0 0 1-.5-.5v-12a.5.5 0 0 1 .5-.5z"/><path d="M10 4h1v5h-1zm0 14h1v5h-1zM8.5 9H10v1H8.5zM11 9h1.5v1H11zm-1 1h1v1h-1zm-1.5 1H10v1H8.5zm2.5 0h1.5v1H11zm-1 1h1v1h-1zm-1.5 1H10v1H8.5zm2.5 0h1.5v1H11zm-1 1h1v1h-1zm-1.5 1H10v1H8.5zm2.5 0h1.5v1H11zm-1 1h1v1h-1zm-1.5 1H10v1H8.5zm2.5 0h1.5v1H11z"/></svg>';
    },
    39681: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="none"><path stroke="currentColor" d="M20 17l-5 5M15 17l5 5M9 11.5h7M17.5 8a2.5 2.5 0 0 0-5 0v11a2.5 2.5 0 0 1-5 0"/></svg>';
    },
    31246: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="currentColor"><path fill-rule="evenodd" d="m18.43 15.91 6.96-8.6-.78-.62-6.96 8.6a2.49 2.49 0 0 0-2.63.2l-2.21-2.02A2.5 2.5 0 0 0 10.5 10a2.5 2.5 0 1 0 1.73 4.3l2.12 1.92a2.5 2.5 0 1 0 4.08-.31ZM10.5 14a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm7.5 3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"/><path d="M8.37 13.8c.17.3.4.54.68.74l-5.67 6.78-.76-.64 5.75-6.88Z"/></svg>';
    },
    41473: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="m25.39 7.31-8.83 10.92-6.02-5.47-7.16 8.56-.76-.64 7.82-9.36 6 5.45L24.61 6.7l.78.62Z"/></svg>';
    },
    96052: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M18.293 13l-2.647 2.646.707.708 3.854-3.854-3.854-3.854-.707.708L18.293 12H12.5A5.5 5.5 0 0 0 7 17.5V19h1v-1.5a4.5 4.5 0 0 1 4.5-4.5h5.793z"/></svg>';
    },
    72644: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.118 6a.5.5 0 0 0-.447.276L9.809 8H5.5A1.5 1.5 0 0 0 4 9.5v10A1.5 1.5 0 0 0 5.5 21h16a1.5 1.5 0 0 0 1.5-1.5v-10A1.5 1.5 0 0 0 21.5 8h-4.309l-.862-1.724A.5.5 0 0 0 15.882 6h-4.764zm-1.342-.17A1.5 1.5 0 0 1 11.118 5h4.764a1.5 1.5 0 0 1 1.342.83L17.809 7H21.5A2.5 2.5 0 0 1 24 9.5v10a2.5 2.5 0 0 1-2.5 2.5h-16A2.5 2.5 0 0 1 3 19.5v-10A2.5 2.5 0 0 1 5.5 7h3.691l.585-1.17z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M13.5 18a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zm0 1a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9z"/></svg>';
    },
    15726: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="currentColor"><path d="M19 5h5v1h-4v13h-6v-7h-4v12H5v-1h4V11h6v7h4V5Z"/></svg>';
    },
    63743: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M11.682 16.09l3.504 6.068 1.732-1-3.497-6.057 3.595-2.1L8 7.74v10.512l3.682-2.163zm-.362 1.372L7 20V6l12 7-4.216 2.462 3.5 6.062-3.464 2-3.5-6.062z"/></svg>';
    },
    18953: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><g fill="currentColor"><path d="M18 15h8v-1h-8z"/><path d="M14 18v8h1v-8zM14 3v8h1v-8zM3 15h8v-1h-8z"/></g></svg>';
    },
    72196: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><circle fill="currentColor" cx="14" cy="14" r="3"/></svg>';
    },
    27999: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 29 31" width="29" height="31"><g fill="currentColor" fill-rule="nonzero"><path d="M15.3 22l8.187-8.187c.394-.394.395-1.028.004-1.418l-4.243-4.243c-.394-.394-1.019-.395-1.407-.006l-11.325 11.325c-.383.383-.383 1.018.007 1.407l1.121 1.121h7.656zm-9.484-.414c-.781-.781-.779-2.049-.007-2.821l11.325-11.325c.777-.777 2.035-.78 2.821.006l4.243 4.243c.781.781.78 2.048-.004 2.832l-8.48 8.48h-8.484l-1.414-1.414z"/><path d="M13.011 22.999h7.999v-1h-7.999zM13.501 11.294l6.717 6.717.707-.707-6.717-6.717z"/></g></svg>';
    },
    10862: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" fill-rule="evenodd" d="M24.13 14.65a6.2 6.2 0 0 0-.46-9.28c-2.57-2.09-6.39-1.71-8.75.6l-.92.91-.92-.9c-2.36-2.32-6.18-2.7-8.75-.61a6.2 6.2 0 0 0-.46 9.28l9.07 8.92c.58.57 1.53.57 2.12 0l9.07-8.92Zm-9.77 8.2 9.07-8.91a5.2 5.2 0 0 0-.39-7.8c-2.13-1.73-5.38-1.45-7.42.55L14 8.29l-1.62-1.6c-2.03-2-5.29-2.28-7.42-.55a5.2 5.2 0 0 0-.4 7.8l9.08 8.91c.2.2.52.2.72 0Z"/></svg>';
    },
    68385: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><g fill="currentColor" fill-rule="evenodd"><path fill-rule="nonzero" d="M14 10a2 2 0 0 0-2 2v11H6V12c0-4.416 3.584-8 8-8s8 3.584 8 8v11h-6V12a2 2 0 0 0-2-2zm-3 2a3 3 0 0 1 6 0v10h4V12c0-3.864-3.136-7-7-7s-7 3.136-7 7v10h4V12z"/><path d="M6.5 18h5v1h-5zm10 0h5v1h-5z"/></g></svg>';
    },
    88518: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"><path fill="currentColor" d="M2 9.75a1.5 1.5 0 0 0-1.5 1.5v5.5a1.5 1.5 0 0 0 1.5 1.5h24a1.5 1.5 0 0 0 1.5-1.5v-5.5a1.5 1.5 0 0 0-1.5-1.5zm0 1h3v2.5h1v-2.5h3.25v3.9h1v-3.9h3.25v2.5h1v-2.5h3.25v3.9h1v-3.9H22v2.5h1v-2.5h3a.5.5 0 0 1 .5.5v5.5a.5.5 0 0 1-.5.5H2a.5.5 0 0 1-.5-.5v-5.5a.5.5 0 0 1 .5-.5z" transform="rotate(-45 14 14)"/></svg>';
    },
    36515: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><g fill="currentColor"><path fill-rule="nonzero" d="M14 18.634l-.307-.239-7.37-5.73-2.137-1.665 9.814-7.633 9.816 7.634-.509.394-1.639 1.269-7.667 5.969zm7.054-6.759l1.131-.876-8.184-6.366-8.186 6.367 1.123.875 7.063 5.491 7.054-5.492z"/><path d="M7 14.5l-1 .57 8 6.43 8-6.5-1-.5-7 5.5z"/><path d="M7 17.5l-1 .57 8 6.43 8-6.5-1-.5-7 5.5z"/></g></svg>';
    },
    7636: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M4.05 14a9.95 9.95 0 1 1 19.9 0 9.95 9.95 0 0 1-19.9 0ZM14 3a11 11 0 1 0 0 22 11 11 0 0 0 0-22Zm-3 13.03a.5.5 0 0 1 .64.3 2.5 2.5 0 0 0 4.72 0 .5.5 0 0 1 .94.34 3.5 3.5 0 0 1-6.6 0 .5.5 0 0 1 .3-.64Zm.5-4.53a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm5 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z"/></svg>';
    },
    62567: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" fill-rule="evenodd" d="M7 4h14a3 3 0 0 1 3 3v11c0 .34-.03.67-.08 1H20.3c-1.28 0-2.31.97-2.31 2.24V24H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3Zm12 19.92A6 6 0 0 0 23.66 20H20.3c-.77 0-1.31.48-1.31 1.24v2.68ZM3 7a4 4 0 0 1 4-4h14a4 4 0 0 1 4 4v11a7 7 0 0 1-7 7H7a4 4 0 0 1-4-4V7Zm8 9.03a.5.5 0 0 1 .64.3 2.5 2.5 0 0 0 4.72 0 .5.5 0 0 1 .94.34 3.5 3.5 0 0 1-6.6 0 .5.5 0 0 1 .3-.64Zm.5-4.53a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm5 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z"/></svg>';
    },
    46049: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" fill-rule="nonzero" d="M14 5a7 7 0 0 0-7 7v3h4v-3a3 3 0 1 1 6 0v3h4v-3a7 7 0 0 0-7-7zm7 11h-4v3h4v-3zm-10 0H7v3h4v-3zm-5-4a8 8 0 1 1 16 0v8h-6v-8a2 2 0 1 0-4 0v8H6v-8zm3.293 11.294l-1.222-2.037.858-.514 1.777 2.963-2 1 1.223 2.037-.858.514-1.778-2.963 2-1zm9.778-2.551l.858.514-1.223 2.037 2 1-1.777 2.963-.858-.514 1.223-2.037-2-1 1.777-2.963z"/></svg>';
    },
    99088: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><g fill="currentColor"><path fill-rule="nonzero" d="M15.039 5.969l-.019-.019-2.828 2.828.707.707 2.474-2.474c1.367-1.367 3.582-1.367 4.949 0s1.367 3.582 0 4.949l-2.474 2.474.707.707 2.828-2.828-.019-.019c1.415-1.767 1.304-4.352-.334-5.99-1.638-1.638-4.224-1.749-5.99-.334zM5.97 15.038l-.019-.019 2.828-2.828.707.707-2.475 2.475c-1.367 1.367-1.367 3.582 0 4.949s3.582 1.367 4.949 0l2.474-2.474.707.707-2.828 2.828-.019-.019c-1.767 1.415-4.352 1.304-5.99-.334-1.638-1.638-1.749-4.224-.334-5.99z"/><path d="M10.485 16.141l5.656-5.656.707.707-5.656 5.656z"/></g></svg>';
    },
    42650: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"><path fill="currentColor" fill-rule="evenodd" d="M19.76 6.07l-.7.7a13.4 13.4 0 011.93 2.47c.19.3.33.55.42.72l.03.04-.03.04a15 15 0 01-2.09 2.9c-1.47 1.6-3.6 3.12-6.32 3.12-.98 0-1.88-.2-2.7-.52l-.77.76c1.03.47 2.18.76 3.47.76 3.12 0 5.5-1.75 7.06-3.44a16 16 0 002.38-3.38v-.02h.01L22 10l.45.22.1-.22-.1-.22L22 10l.45-.22-.01-.02a5.1 5.1 0 00-.15-.28 16 16 0 00-2.53-3.41zM6.24 13.93l.7-.7-.27-.29a15 15 0 01-2.08-2.9L4.56 10l.03-.04a15 15 0 012.09-2.9c1.47-1.6 3.6-3.12 6.32-3.12.98 0 1.88.2 2.7.52l.77-.76A8.32 8.32 0 0013 2.94c-3.12 0-5.5 1.75-7.06 3.44a16 16 0 00-2.38 3.38v.02h-.01L4 10l-.45-.22-.1.22.1.22L4 10l-.45.22.01.02a5.5 5.5 0 00.15.28 16 16 0 002.53 3.41zm6.09-.43a3.6 3.6 0 004.24-4.24l-.93.93a2.6 2.6 0 01-2.36 2.36l-.95.95zm-1.97-3.69l-.93.93a3.6 3.6 0 014.24-4.24l-.95.95a2.6 2.6 0 00-2.36 2.36zm11.29 7.84l-.8.79a1.5 1.5 0 000 2.12l.59.59a1.5 1.5 0 002.12 0l1.8-1.8-.71-.7-1.8 1.79a.5.5 0 01-.7 0l-.59-.59a.5.5 0 010-.7l.8-.8-.71-.7zm-5.5 3.5l.35.35-.35-.35.01-.02.02-.02.02-.02a4.68 4.68 0 01.65-.5c.4-.27 1-.59 1.65-.59.66 0 1.28.33 1.73.77.44.45.77 1.07.77 1.73a2.5 2.5 0 01-.77 1.73 2.5 2.5 0 01-1.73.77h-4a.5.5 0 01-.42-.78l1-1.5 1-1.5a.5.5 0 01.07-.07zm.74.67a3.46 3.46 0 01.51-.4c.35-.24.75-.42 1.1-.42.34 0 .72.17 1.02.48.3.3.48.68.48 1.02 0 .34-.17.72-.48 1.02-.3.3-.68.48-1.02.48h-3.07l.49-.72.97-1.46zM21.2 2.5L5.5 18.2l-.7-.7L20.5 1.8l.7.7z"/></svg>';
    },
    75895: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"><path fill="currentColor" d="M16.47 3.7A8.32 8.32 0 0013 2.94c-3.12 0-5.5 1.75-7.06 3.44a16 16 0 00-2.38 3.38v.02h-.01L4 10l-.45-.22-.1.22.1.22L4 10l-.45.22.01.02a5.5 5.5 0 00.15.28 16 16 0 002.53 3.41l.7-.7-.27-.29a15 15 0 01-2.08-2.9L4.56 10l.03-.04a15 15 0 012.09-2.9c1.47-1.6 3.6-3.12 6.32-3.12.98 0 1.88.2 2.7.52l.77-.76zm-7.04 7.04l.93-.93a2.6 2.6 0 012.36-2.36l.95-.95a3.6 3.6 0 00-4.24 4.24zm.1 5.56c1.03.47 2.18.76 3.47.76 3.12 0 5.5-1.75 7.06-3.44a16 16 0 002.38-3.38v-.02h.01L22 10l.45.22.1-.22-.1-.22L22 10l.45-.22-.01-.02-.02-.03-.01-.03a9.5 9.5 0 00-.57-1 16 16 0 00-2.08-2.63l-.7.7.27.29a15.01 15.01 0 012.08 2.9l.03.04-.03.04a15 15 0 01-2.09 2.9c-1.47 1.6-3.6 3.12-6.32 3.12-.98 0-1.88-.2-2.7-.52l-.77.76zm2.8-2.8a3.6 3.6 0 004.24-4.24l-.93.93a2.6 2.6 0 01-2.36 2.36l-.95.95zm7.9 3.73c-.12.12-.23.35-.23.77v2h1v1h-1v2c0 .58-.14 1.1-.52 1.48-.38.38-.9.52-1.48.52s-1.1-.14-1.48-.52c-.38-.38-.52-.9-.52-1.48h1c0 .42.1.65.23.77.12.12.35.23.77.23.42 0 .65-.1.77-.23.12-.12.23-.35.23-.77v-2h-1v-1h1v-2c0-.58.14-1.1.52-1.48.38-.38.9-.52 1.48-.52s1.1.14 1.48.52c.38.38.52.9.52 1.48h-1c0-.42-.1-.65-.23-.77-.12-.12-.35-.23-.77-.23-.42 0-.65.1-.77.23zm2.56 6.27l-1.14-1.15.7-.7 1.15 1.14 1.15-1.14.7.7-1.14 1.15 1.14 1.15-.7.7-1.15-1.14-1.15 1.14-.7-.7 1.14-1.15zM21.2 2.5L5.5 18.2l-.7-.7L20.5 1.8l.7.7z"/></svg>';
    },
    65162: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M5.5 18.2L21.2 2.5l-.7-.7L4.8 17.5l.7.7zM19.05 6.78l.71-.7a14.26 14.26 0 0 1 2.08 2.64 14.26 14.26 0 0 1 .6 1.05v.02h.01L22 10l.45.22-.01.02a5.18 5.18 0 0 1-.15.28 16 16 0 0 1-2.23 3.1c-1.56 1.69-3.94 3.44-7.06 3.44-1.29 0-2.44-.3-3.47-.76l.76-.76c.83.32 1.73.52 2.71.52 2.73 0 4.85-1.53 6.33-3.12a15.01 15.01 0 0 0 2.08-2.9l.03-.04-.03-.04a15 15 0 0 0-2.36-3.18zM22 10l.45-.22.1.22-.1.22L22 10zM6.94 13.23l-.7.7a14.24 14.24 0 0 1-2.08-2.64 14.28 14.28 0 0 1-.6-1.05v-.02h-.01L4 10l-.45-.22.01-.02a5.55 5.55 0 0 1 .15-.28 16 16 0 0 1 2.23-3.1C7.5 4.69 9.88 2.94 13 2.94c1.29 0 2.44.3 3.47.76l-.76.76A7.27 7.27 0 0 0 13 3.94c-2.73 0-4.85 1.53-6.33 3.12a15 15 0 0 0-2.08 2.9l-.03.04.03.04a15.01 15.01 0 0 0 2.36 3.18zM4 10l-.45.22-.1-.22.1-.22L4 10zm9 3.56c-.23 0-.46-.02-.67-.06l.95-.95a2.6 2.6 0 0 0 2.36-2.36l.93-.93a3.6 3.6 0 0 1-3.57 4.3zm-3.57-2.82l.93-.93a2.6 2.6 0 0 1 2.36-2.36l.95-.95a3.6 3.6 0 0 0-4.24 4.24zM17.5 21.9l3.28 2.18a.5.5 0 1 1-.56.84L17.5 23.1l-2.72 1.82a.5.5 0 1 1-.56-.84l3.28-2.18zM18.58 19.22a.5.5 0 0 1 .7-.14L22 20.9l2.72-1.82a.5.5 0 0 1 .56.84L22 22.1l-3.28-2.18a.5.5 0 0 1-.14-.7z"/></svg>';
    },
    65186: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" fill-rule="evenodd" d="M14 6a3 3 0 0 0-3 3v3h6V9a3 3 0 0 0-3-3zm4 6V9a4 4 0 0 0-8 0v3H8.5A2.5 2.5 0 0 0 6 14.5v7A2.5 2.5 0 0 0 8.5 24h11a2.5 2.5 0 0 0 2.5-2.5v-7a2.5 2.5 0 0 0-2.5-2.5H18zm-5 5a1 1 0 1 1 2 0v2a1 1 0 1 1-2 0v-2zm-6-2.5c0-.83.67-1.5 1.5-1.5h11c.83 0 1.5.67 1.5 1.5v7c0 .83-.67 1.5-1.5 1.5h-11A1.5 1.5 0 0 1 7 21.5v-7z"/></svg>';
    },
    91244: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" fill-rule="evenodd" d="M14 6a3 3 0 0 0-3 3v3h8.5a2.5 2.5 0 0 1 2.5 2.5v7a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 6 21.5v-7A2.5 2.5 0 0 1 8.5 12H10V9a4 4 0 0 1 8 0h-1a3 3 0 0 0-3-3zm-1 11a1 1 0 1 1 2 0v2a1 1 0 1 1-2 0v-2zm-6-2.5c0-.83.67-1.5 1.5-1.5h11c.83 0 1.5.67 1.5 1.5v7c0 .83-.67 1.5-1.5 1.5h-11A1.5 1.5 0 0 1 7 21.5v-7z"/></svg>';
    },
    45820: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"><path fill="currentColor" fill-rule="evenodd" d="M4.56 14a10.05 10.05 0 00.52.91c.41.69 1.04 1.6 1.85 2.5C8.58 19.25 10.95 21 14 21c3.05 0 5.42-1.76 7.07-3.58A17.18 17.18 0 0023.44 14a9.47 9.47 0 00-.52-.91c-.41-.69-1.04-1.6-1.85-2.5C19.42 8.75 17.05 7 14 7c-3.05 0-5.42 1.76-7.07 3.58A17.18 17.18 0 004.56 14zM24 14l.45-.21-.01-.03a7.03 7.03 0 00-.16-.32c-.11-.2-.28-.51-.5-.87-.44-.72-1.1-1.69-1.97-2.65C20.08 7.99 17.45 6 14 6c-3.45 0-6.08 2-7.8 3.92a18.18 18.18 0 00-2.64 3.84v.02h-.01L4 14l-.45-.21-.1.21.1.21L4 14l-.45.21.01.03a5.85 5.85 0 00.16.32c.11.2.28.51.5.87.44.72 1.1 1.69 1.97 2.65C7.92 20.01 10.55 22 14 22c3.45 0 6.08-2 7.8-3.92a18.18 18.18 0 002.64-3.84v-.02h.01L24 14zm0 0l.45.21.1-.21-.1-.21L24 14zm-10-3a3 3 0 100 6 3 3 0 000-6zm-4 3a4 4 0 118 0 4 4 0 01-8 0z"/></svg>';
    },
    93756: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"><path fill="currentColor" fill-rule="evenodd" d="M5 10.76l-.41-.72-.03-.04.03-.04a15 15 0 012.09-2.9c1.47-1.6 3.6-3.12 6.32-3.12 2.73 0 4.85 1.53 6.33 3.12a15.01 15.01 0 012.08 2.9l.03.04-.03.04a15 15 0 01-2.09 2.9c-1.47 1.6-3.6 3.12-6.32 3.12-2.73 0-4.85-1.53-6.33-3.12a15 15 0 01-1.66-2.18zm17.45-.98L22 10l.45.22-.01.02a5.04 5.04 0 01-.15.28 16.01 16.01 0 01-2.23 3.1c-1.56 1.69-3.94 3.44-7.06 3.44-3.12 0-5.5-1.75-7.06-3.44a16 16 0 01-2.38-3.38v-.02h-.01L4 10l-.45-.22.01-.02a5.4 5.4 0 01.15-.28 16 16 0 012.23-3.1C7.5 4.69 9.88 2.94 13 2.94c3.12 0 5.5 1.75 7.06 3.44a16.01 16.01 0 012.38 3.38v.02h.01zM22 10l.45-.22.1.22-.1.22L22 10zM3.55 9.78L4 10l-.45.22-.1-.22.1-.22zm6.8.22A2.6 2.6 0 0113 7.44 2.6 2.6 0 0115.65 10 2.6 2.6 0 0113 12.56 2.6 2.6 0 0110.35 10zM13 6.44A3.6 3.6 0 009.35 10 3.6 3.6 0 0013 13.56c2 0 3.65-1.58 3.65-3.56A3.6 3.6 0 0013 6.44zm7.85 12l.8-.8.7.71-.79.8a.5.5 0 000 .7l.59.59c.2.2.5.2.7 0l1.8-1.8.7.71-1.79 1.8a1.5 1.5 0 01-2.12 0l-.59-.59a1.5 1.5 0 010-2.12zM16.5 21.5l-.35-.35a.5.5 0 00-.07.07l-1 1.5-1 1.5a.5.5 0 00.42.78h4a2.5 2.5 0 001.73-.77A2.5 2.5 0 0021 22.5a2.5 2.5 0 00-.77-1.73A2.5 2.5 0 0018.5 20a3.1 3.1 0 00-1.65.58 5.28 5.28 0 00-.69.55v.01h-.01l.35.36zm.39.32l-.97 1.46-.49.72h3.07c.34 0 .72-.17 1.02-.48.3-.3.48-.68.48-1.02 0-.34-.17-.72-.48-1.02-.3-.3-.68-.48-1.02-.48-.35 0-.75.18-1.1.42a4.27 4.27 0 00-.51.4z"/></svg>';
    },
    42321: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"><path fill="currentColor" fill-rule="evenodd" d="M5 10.76a13.27 13.27 0 01-.41-.72L4.56 10l.03-.04a15 15 0 012.08-2.9c1.48-1.6 3.6-3.12 6.33-3.12s4.85 1.53 6.33 3.12a15.01 15.01 0 012.08 2.9l.03.04-.03.04a15 15 0 01-2.08 2.9c-1.48 1.6-3.6 3.12-6.33 3.12s-4.85-1.53-6.33-3.12a15 15 0 01-1.66-2.18zm17.45-.98L22 10l.45.22-.01.02a14.3 14.3 0 01-.6 1.05c-.4.64-1 1.48-1.78 2.33-1.56 1.7-3.94 3.44-7.06 3.44s-5.5-1.75-7.06-3.44a16 16 0 01-2.23-3.1 9.39 9.39 0 01-.15-.28v-.02h-.01L4 10l-.45-.22.01-.02a5.59 5.59 0 01.15-.28 16 16 0 012.23-3.1C7.5 4.69 9.87 2.94 13 2.94c3.12 0 5.5 1.75 7.06 3.44a16 16 0 012.23 3.1 9.5 9.5 0 01.15.28v.01l.01.01zM22 10l.45-.22.1.22-.1.22L22 10zM3.55 9.78L4 10l-.45.22-.1-.22.1-.22zm6.8.22A2.6 2.6 0 0113 7.44 2.6 2.6 0 0115.65 10 2.6 2.6 0 0113 12.56 2.6 2.6 0 0110.35 10zM13 6.44A3.6 3.6 0 009.35 10c0 1.98 1.65 3.56 3.65 3.56s3.65-1.58 3.65-3.56A3.6 3.6 0 0013 6.44zM20 18c0-.42.1-.65.23-.77.12-.13.35-.23.77-.23.42 0 .65.1.77.23.13.12.23.35.23.77h1c0-.58-.14-1.1-.52-1.48-.38-.38-.9-.52-1.48-.52s-1.1.14-1.48.52c-.37.38-.52.9-.52 1.48v2h-1v1h1v2c0 .42-.1.65-.23.77-.12.13-.35.23-.77.23-.42 0-.65-.1-.77-.23-.13-.12-.23-.35-.23-.77h-1c0 .58.14 1.1.52 1.48.38.37.9.52 1.48.52s1.1-.14 1.48-.52c.37-.38.52-.9.52-1.48v-2h1v-1h-1v-2zm1.65 4.35l1.14 1.15-1.14 1.15.7.7 1.15-1.14 1.15 1.14.7-.7-1.14-1.15 1.14-1.15-.7-.7-1.15 1.14-1.15-1.14-.7.7z"/></svg>';
    },
    57313: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" fill-rule="evenodd" d="M4.5 10a8.46 8.46 0 0 0 .46.8c.38.6.94 1.4 1.68 2.19 1.48 1.6 3.62 3.13 6.36 3.13s4.88-1.53 6.36-3.13A15.07 15.07 0 0 0 21.5 10a7.41 7.41 0 0 0-.46-.8c-.38-.6-.94-1.4-1.68-2.19-1.48-1.6-3.62-3.13-6.36-3.13S8.12 5.4 6.64 7A15.07 15.07 0 0 0 4.5 10zM22 10l.41-.19-.4.19zm0 0l.41.19-.4-.19zm.41.19l.09-.19-.09-.19-.01-.02a6.86 6.86 0 0 0-.15-.28c-.1-.18-.25-.45-.45-.76-.4-.64-.99-1.48-1.77-2.32C18.47 4.74 16.11 3 13 3 9.89 3 7.53 4.74 5.97 6.43A15.94 15.94 0 0 0 3.6 9.79v.02h-.01L3.5 10l.09.19.01.02a6.59 6.59 0 0 0 .15.28c.1.18.25.45.45.76.4.64.99 1.48 1.77 2.32C7.53 15.26 9.89 17 13 17c3.11 0 5.47-1.74 7.03-3.43a15.94 15.94 0 0 0 2.37-3.36v-.02h.01zM4 10l-.41-.19.4.19zm9-2.63c-1.5 0-2.7 1.18-2.7 2.63s1.2 2.63 2.7 2.63c1.5 0 2.7-1.18 2.7-2.63S14.5 7.37 13 7.37zM9.4 10C9.4 8.07 11 6.5 13 6.5s3.6 1.57 3.6 3.5S15 13.5 13 13.5A3.55 3.55 0 0 1 9.4 10zm8.1 11.9l3.28 2.18a.5.5 0 1 1-.56.84L17.5 23.1l-2.72 1.82a.5.5 0 1 1-.56-.84l3.28-2.18zm1.78-2.82a.5.5 0 0 0-.56.84L22 22.1l3.28-2.18a.5.5 0 1 0-.56-.84L22 20.9l-2.72-1.82z"/></svg>';
    },
    6894: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="currentColor"><path d="M17.646 18.354l4 4 .708-.708-4-4z"/><path d="M12.5 21a8.5 8.5 0 1 1 0-17 8.5 8.5 0 0 1 0 17zm0-1a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15z"/><path d="M9 13h7v-1H9z"/><path d="M13 16V9h-1v7z"/></svg>';
    },
    45360: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="currentColor"><path d="M17.646 18.354l4 4 .708-.708-4-4z"/><path d="M12.5 21a8.5 8.5 0 1 1 0-17 8.5 8.5 0 0 1 0 17zm0-1a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15z"/><path d="M9 13h7v-1H9z"/></svg>';
    },
    77665: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M8.707 13l2.647 2.646-.707.708L6.792 12.5l3.853-3.854.708.708L8.707 12H14.5a5.5 5.5 0 0 1 5.5 5.5V19h-1v-1.5a4.5 4.5 0 0 0-4.5-4.5H8.707z"/></svg>';
    },
    90752: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="none"><path stroke="currentColor" d="M5.5 13v-2.5m8.5 11h6.5a2 2 0 0 0 2-2v-9m-17 0v-2c0-1.1.9-2 2-2h13a2 2 0 0 1 2 2v2m-17 0h17"/><path fill="currentColor" d="M10 4h1v4h-1V4zM17 4h1v4h-1V4z"/><path stroke="currentColor" d="M4 18.5h7.5m0 0L8 22m3.5-3.5L8 15"/></svg>';
    },
    81111: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28" fill="none"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M4 6.5C4 5.67 4.67 5 5.5 5h4.2l.15.15L11.71 7h8.79c.83 0 1.5.67 1.5 1.5V11H5V20.5c0 .28.22.5.5.5H9v1H5.5A1.5 1.5 0 0 1 4 20.5V6.5zM5 10h16V8.5a.5.5 0 0 0-.5-.5h-9.2l-.15-.15L9.29 6H5.5a.5.5 0 0 0-.5.5V10z"/><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M14.85 16.85l3.5-3.5-.7-.7-3.5 3.5a1.5 1.5 0 1 0 0 2.7l1.64 1.65-1.64 1.65a1.5 1.5 0 1 0 .7.7l1.65-1.64 1.65 1.64a1.5 1.5 0 1 0 2.7 0l3.5-3.5-.7-.7-3.5 3.5a1.5 1.5 0 0 0-1.3 0l-1.64-1.65 4.14-4.15-.7-.7-4.15 4.14-1.65-1.64a1.5 1.5 0 0 0 0-1.3zm-.85.65a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm6 6a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm-6.5.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z"/></svg>';
    },
    30192: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M13.39 3.84a1 1 0 0 1 1.22 0l8.19 6.37a1 1 0 0 1 0 1.58l-8.19 6.37a1 1 0 0 1-1.22 0L5.2 11.79a1 1 0 0 1 0-1.58l8.19-6.37zm.61.8L5.81 11 14 17.37 22.19 11 14 4.63zM5.3 13.6l8.7 6.76 8.7-6.76.6.78-8.69 6.77a1 1 0 0 1-1.22 0l-8.7-6.77.62-.78zm8.09 10.55l-8.7-6.77.62-.78L14 23.37l8.7-6.76.6.78-8.69 6.77a1 1 0 0 1-1.22 0z"/></svg>';
    },
  },
]);
