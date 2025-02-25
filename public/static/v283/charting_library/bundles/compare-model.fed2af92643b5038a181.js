"use strict";
(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [7271],
  {
    18429: (e, t, o) => {
      o.d(t, { SEPARATOR_PREFIX: () => s, isSeparatorItem: () => n });
      const s = "###";
      function n(e) {
        return e.startsWith(s);
      }
    },
    3685: (e, t, o) => {
      function s() {
        var e, t, o;
        return null !==
          (o =
            null ===
              (t =
                null === (e = window.configurationData) || void 0 === e
                  ? void 0
                  : e.exchanges) || void 0 === t
              ? void 0
              : t.map((e) => ({
                  ...e,
                  country: "",
                  providerId: "",
                  flag: "",
                }))) && void 0 !== o
          ? o
          : [];
      }
      o.d(t, { getExchanges: () => s });
    },
    58442: (e, t, o) => {
      o.d(t, { QualifiedSources: () => s, qualifyProName: () => i });
      var s,
        n = o(50151),
        r = o(56570);
      o(81319);
      function i(e) {
        return e;
      }
      !(function (e) {
        function t(e) {
          return e.pro_name;
        }
        function o(e) {
          {
            const t = r.enabled("pay_attention_to_ticker_not_symbol")
              ? e.ticker
              : e.name;
            return (0, n.ensureDefined)(t);
          }
        }
        (e.fromQuotesSnapshot = function (e) {
          return "error" === e.status ? e.symbolname : e.values.pro_name;
        }),
          (e.fromQuotesResponse = function (e) {
            const { values: o, symbolname: s, status: n } = e;
            return "error" === n && s ? s : t(o);
          }),
          (e.fromQuotes = t),
          (e.fromSymbolSearchResult = function (e, t) {
            {
              const { ticker: o, symbol: s } = null != t ? t : e;
              return r.enabled("pay_attention_to_ticker_not_symbol")
                ? (0, n.ensureDefined)(null != o ? o : s)
                : (0, n.ensureDefined)(s);
            }
          }),
          (e.fromSymbolInfo = o),
          (e.fromSymbolMessage = function (e, t) {
            return "symbol_resolved" === t.method ? o(t.params[1]) : e;
          });
      })(s || (s = {}));
    },
    20882: (e, t, o) => {
      o.d(t, {
        createSearchSources: () => a,
        filterSearchSources: () => r,
        isAllSearchSourcesSelected: () => n,
        splitSearchSourcesByGroup: () => i,
      });
      const s = [];
      function n(e) {
        return "" === e.value();
      }
      function r(e, t) {
        return e.filter((e) => e.includes(t));
      }
      function i(e) {
        const t = new Map();
        e.forEach((e) => {
          t.has(e.group()) ? t.get(e.group()).push(e) : t.set(e.group(), [e]);
        });
        for (const e of t.values()) {
          e[0].group() !== ExchangeGroup.NorthAmerica &&
            e.sort((e, t) =>
              e.name().toLowerCase() > t.name().toLowerCase() ? 1 : -1,
            );
        }
        return new Map(
          [...t.entries()].sort(([e], [t]) => s.indexOf(e) - s.indexOf(t)),
        );
      }
      function a(e, t) {
        return t.map((t) => new e(t));
      }
    },
    81319: (e, t, o) => {
      o.d(t, {
        createGroupColumns: () => m,
        exchangeSelectDisabled: () => h,
        getAllSymbolTypesValue: () => u,
        getAvailableSearchSources: () => l,
        getAvailableSymbolTypes: () => d,
        getDefaultSearchSource: () => c,
        getSymbolFullName: () => a,
        isSeparateSymbolSearchTabs: () => y,
      });
      var s = o(11542),
        n = o(20882);
      class r {
        constructor(e) {
          this._exchange = e;
        }
        value() {
          return this._exchange.value;
        }
        name() {
          return (0, n.isAllSearchSourcesSelected)(this)
            ? s.t(null, void 0, o(34040))
            : this._exchange.name;
        }
        description() {
          return this._exchange.desc;
        }
        country() {
          return this._exchange.country;
        }
        providerId() {
          return this._exchange.providerId;
        }
        group() {
          return this._exchange.group;
        }
        includes(e) {
          return (function (e, t) {
            const o = t.toLowerCase(),
              { name: s, desc: n, searchTerms: r } = e;
            return (
              s.toLowerCase().includes(o) ||
              n.toLowerCase().includes(o) ||
              (void 0 !== r && r.some((e) => e.toLowerCase().includes(o)))
            );
          })(this._exchange, e);
        }
        getRequestExchangeValue() {
          return this._exchange.value;
        }
        getRequestCountryValue() {}
      }
      var i = o(3685);
      function a(e) {
        if (e.fullName) return e.fullName;
        let t;
        return (
          (t =
            e.prefix || e.exchange
              ? (e.prefix || e.exchange) + ":" + e.name
              : e.name),
          t.replace(/<\/?[^>]+(>|$)/g, "")
        );
      }
      function c() {
        const e = l();
        return e.find(n.isAllSearchSourcesSelected) || e[0] || null;
      }
      function l() {
        return (0, n.createSearchSources)(r, (0, i.getExchanges)());
      }
      function d() {
        return window.ChartApiInstance.supportedSymbolsTypes();
      }
      function u() {
        return "";
      }
      function h(e) {
        return !!y && !TAB_SOURCE_FILTER_MAP[e];
      }
      function m(e, t = 2) {
        if (0 === e.length) return [];
        if (1 === t) return [e];
        const o = Math.floor(e.length / 2) + (e.length % 2);
        return [e.slice(0, o), e.slice(o)].filter((e) => e.length > 0);
      }
      const y = !1;
    },
    56217: (e, t, o) => {
      o.r(t), o.d(t, { CompareModel: () => v });
      var s = o(50151),
        n = o(56570),
        r = o(3462),
        i = o(73698),
        a = o(64147),
        c = o(46148),
        l = o(72708),
        d = o(3685),
        u = o(58442);
      new Set(
        n.enabled("widget")
          ? [
              "pro_name",
              "short_name",
              "description",
              "exchange",
              "type",
              "country_code",
              "provider_id",
              "typespecs",
            ]
          : [
              "pro_name",
              "short_name",
              "description",
              "exchange",
              "type",
              "country_code",
              "provider_id",
              "typespecs",
              "logoid",
              "currency-logoid",
              "base-currency-logoid",
            ],
      );
      const h = (0, d.getExchanges)(),
        m = {};
      for (const e of h)
        m[e.value] = { country: e.country, providerId: e.providerId };
      var y = o(88145);
      function S(e) {
        return (0, l.isCompareOrOverlayStudy)(e);
      }
      function _(e, t, o) {
        const s = u.QualifiedSources.fromSymbolInfo(e),
          n = (function (e) {
            if (!e) return;
            const [t, o] = e.split(":");
            return o && t && m[t] ? m[t] : void 0;
          })(s),
          r = {
            id: (null == o ? void 0 : o.id()) || s,
            symbol: s,
            checked: t,
            title: e.name,
            description: e.description,
            exchangeName: e.exchange,
            country: null == n ? void 0 : n.country,
            providerId: null == n ? void 0 : n.providerId,
            marketType: e.type,
            study: o,
            isYield: (0, y.isYield)(e),
          };
        {
          const t = e;
          t.logo_urls &&
            t.logo_urls.length &&
            (t.logo_urls.length > 1
              ? ((r.baseCurrencyLogoId = t.logo_urls[0]),
                (r.currencyLogoId = t.logo_urls[1]))
              : (r.logoId = t.logo_urls[0])),
            t.exchange_logo && (r.providerId = t.exchange_logo);
        }
        return r;
      }
      function p(e, t, o, s) {
        return {
          id: void 0 !== o ? o.id() : e,
          symbol: e,
          checked: t,
          title: e,
          study: o,
          description: s,
        };
      }
      var f = o(56840),
        g = o(76422),
        b = o(18429);
      class v {
        constructor(e) {
          (this._contentItemList = new a.WatchedValue([])),
            (this._checkedSymbols = new Map()),
            (this._recentLength = 10),
            (this._isDataReady = new a.WatchedValue(!1)),
            (this._highlightedSymbol = new a.WatchedValue(null)),
            (this._defaultSymbolsDescriptions = new Map()),
            (this._idToStudyMap = new Map()),
            (this._chartSession = null),
            (this._recentSymbolsEnabled = n.enabled(
              "compare_recent_symbols_enabled",
            )),
            (this._preventHandleSourcesChange = !0),
            (this.removeStudy = (e) => {
              const { symbol: t, study: o } = e;
              if (!o) return;
              this._chartWidget.model().removeSource(o, !1);
              const s = this._checkedSymbols.get(t);
              s && s.length > 1
                ? this._removeStudyIdFromCheckedSymbols(t, o.id())
                : this._checkedSymbols.delete(t),
                this._updateContentItemList(this._contentItemList.value(), !0);
            }),
            (this._getResolveSymbolPromise = (e, t) =>
              new Promise((o) => {
                const n = (0, s.ensureNotNull)(
                  this._chartSession,
                ).resolveSymbol(
                  (0, r.makeNextSymbolId)(),
                  (0, i.encodeExtendedSymbolOrGetSimpleSymbolString)({
                    symbol: e,
                  }),
                  o,
                );
                t && t.set(e, n);
              })),
            (this._chartWidget = e.activeChartWidget.value()),
            (this._chartSession = this._chartWidget.model().model().chartApi());
          const t = new Set(this._loadRecent().reverse()),
            o = new Set(),
            c = new Set(),
            l = this._chartWidget.model().model().dataSources().filter(S),
            d = l.map((e) => {
              const t = e.symbolInfo();
              if (t)
                return Promise.resolve(u.QualifiedSources.fromSymbolInfo(t));
              const o = e.symbol();
              return (0, u.qualifyProName)(o);
            });
          Promise.all(d).then((e) => {
            const s = e.map((e, t) => l[t]);
            e.forEach((e, n) => {
              const r = s[n],
                i = r.id();
              this._addStudyIdToCheckedSymbols(e, i),
                this._idToStudyMap.set(i, r),
                t.has(e) ? o.add(e) : c.add(e);
            });
            const n = Array.from(t)
                .filter((e) => this._checkedSymbols.has(e))
                .reduce((e, t) => (o.has(t) && e.push(t), e), [])
                .concat(Array.from(c)),
              r = Array.from(t);
            if (this._recentSymbolsEnabled && r.length < this._recentLength) {
              let e;
              (e = []),
                this._chartWidget.compareSymbols() &&
                  this._chartWidget.compareSymbols().forEach((t) => {
                    e.push((0, u.qualifyProName)(t.symbol)),
                      this._defaultSymbolsDescriptions.set(t.symbol, t.title);
                  });
              const t = [...r, ...e];
              n.push(...t);
            } else n.push(...r);
            const i = Array.from(new Set(n));
            {
              const e = new Map(),
                t = i.map((t) => this._getResolveSymbolPromise(t, e));
              Promise.all(t).then((t) =>
                this._handleInitProcess(
                  n,
                  (o) => {
                    const s = e.get(o);
                    return t.find((e) => e.params[0] === s);
                  },
                  (e, t) => u.QualifiedSources.fromSymbolMessage(t, e),
                  (e, t, o, s) =>
                    "symbol_resolved" === e.method
                      ? _(e.params[1], o, s)
                      : p(t, o, s, this._getSymbolDescription(t)),
                ),
              );
            }
          });
        }
        chartModel() {
          return this._chartWidget.model().model();
        }
        comparableOnSameScale(e) {
          return (
            this._chartWidget.model().model().mainSeries().isYield() &&
            Boolean(e.isYield)
          );
        }
        handleSourcesChange() {
          if (this._preventHandleSourcesChange) return;
          const e = this.chartModel().dataSources().filter(S),
            t = new Set(e.map((e) => e.id()));
          Array.from(t).forEach((e) => {
            if (!this._checkedStudiesIds().has(e)) {
              const t = this.chartModel().dataSourceForId(e) || null;
              if (null !== t && S(t)) {
                const t = this._getContentItemByStudyId(e);
                if (!t) return;
                this._addStudyIdToCheckedSymbols(t.symbol, e),
                  this._saveRecent(t.symbol),
                  this._updateContentItemList(
                    this._contentItemList.value(),
                    !0,
                  );
              }
            }
          });
          Array.from(this._checkedStudiesIds()).forEach((e) => {
            if (!t.has(e)) {
              const t = this._getContentItemByStudyId(e);
              if (!t) return;
              const o = this._checkedSymbols.get(t.symbol);
              o && o.length > 1
                ? this._removeStudyIdFromCheckedSymbols(t.symbol, e)
                : this._checkedSymbols.delete(t.symbol),
                this._updateContentItemList(this._contentItemList.value(), !0);
            }
          });
        }
        studies() {
          return this._contentItemList.readonly();
        }
        isDataReady() {
          return this._isDataReady.readonly();
        }
        highlightedSymbol() {
          return this._highlightedSymbol.readonly();
        }
        applyStudy(e, t, o) {
          (() => {
            const s = this._chartWidget;
            if (!s) return;
            if (((n = e), (0, b.isSeparatorItem)(n))) return;
            var n;
            let r;
            switch (t) {
              case c.CompareOption.SamePctScale:
                r = s.addCompareAsOverlay(e, o);
                break;
              case c.CompareOption.SameScale:
                r = s.addCompareAsOverlay(e, o, !0);
                break;
              case c.CompareOption.NewPriceScale:
                r = s.addOverlayStudy(e, !0, o);
                break;
              case c.CompareOption.NewPane:
                r = s.addOverlayStudy(e, !1, o);
            }
            Promise.all([this._getResolveSymbolPromise(e), r]).then((t) =>
              this._handleApplyProcess(
                t,
                (t) => u.QualifiedSources.fromSymbolMessage(e, t),
                (e, t, o) =>
                  "symbol_resolved" === e.method
                    ? _(e.params[1], !0, o)
                    : p(t, !0, o),
              ),
            ),
              g.emit("add_compare");
          })();
        }
        _snapshoter() {
          throw new Error("not implemented");
        }
        _handleApplyProcess(e, t, o) {
          const [s, n] = e;
          if (!s || null === n) return;
          const r = n.id(),
            i = t(s),
            a = o(s, i, n);
          this._saveRecent(i),
            this._addStudyIdToCheckedSymbols(i, r),
            this._showNewItem(a, i, r);
        }
        _handleInitProcess(e, t, o, s) {
          const n = [];
          for (const r of e) {
            const e = t(r);
            if (!e) continue;
            const i = o(e, r),
              a = this._checkedSymbols.get(i),
              c = -1 !== n.findIndex((e) => e.symbol === i);
            if (void 0 === a || c)
              this._recentSymbolsEnabled && n.push(s(e, i, !1));
            else
              for (const t of a) n.push(s(e, i, !0, this._idToStudyMap.get(t)));
          }
          this._updateContentItemList(n), this._isDataReady.setValue(!0);
        }
        _showNewItem(e, t, o) {
          const s = this._contentItemList
            .value()
            .map(this._updateChecked, this);
          s.unshift(e),
            this._recentSymbolsEnabled &&
              s.unshift({ ...e, id: t, study: void 0, checked: !1 }),
            this._updateContentItemList(s),
            this._highlightedSymbol.setValue(o),
            setTimeout(() => this._highlightedSymbol.setValue(null), 500);
        }
        _addStudyIdToCheckedSymbols(e, t) {
          const o = this._checkedSymbols.get(e) || [];
          this._checkedSymbols.set(e, [...o, t]);
        }
        _removeStudyIdFromCheckedSymbols(e, t) {
          const o = this._checkedSymbols.get(e);
          if (o) {
            const s = o.indexOf(t);
            o.splice(s, 1), this._checkedSymbols.set(e, o);
          }
        }
        _updateChecked(e) {
          var t;
          const o = this._checkedSymbols.get(e.symbol),
            s = null === (t = e.study) || void 0 === t ? void 0 : t.id();
          return s ? { ...e, checked: Boolean(o && o.includes(s)) } : e;
        }
        _updateContentItemList(e, t) {
          const o = t ? e.map(this._updateChecked, this) : e,
            s = o.filter((e) => e.checked);
          if (this._recentSymbolsEnabled) {
            const e = new Set(),
              t = o
                .reduce(
                  (t, o) => (
                    o.checked ||
                      e.has(o.symbol) ||
                      (t.push(o), e.add(o.symbol)),
                    t
                  ),
                  [],
                )
                .slice(0, this._recentLength);
            this._contentItemList.setValue(s.concat(t));
          } else this._contentItemList.setValue(s);
        }
        _checkedStudiesIds() {
          const e = [].concat(...Array.from(this._checkedSymbols.values()));
          return new Set(e);
        }
        _getContentItemByStudyId(e) {
          const t = this._contentItemList.value(),
            o = t.findIndex((t) => t.study && t.study.id() === e);
          return t[o];
        }
        _loadRecent() {
          if (!this._recentSymbolsEnabled) return [];
          return f
            .getJSON("CompareDialog.recent", [])
            .filter((e) => "string" == typeof e);
        }
        _saveRecent(e) {
          if (!this._recentSymbolsEnabled) return;
          const t = new Set(this._loadRecent());
          t.has(e) && t.delete(e),
            t.add(e),
            f.setJSON(
              "CompareDialog.recent",
              Array.from(t).slice(-this._recentLength),
            );
        }
        _getSymbolDescription(e) {
          var t;
          return this._defaultSymbolsDescriptions.size &&
            null !== (t = this._defaultSymbolsDescriptions.get(e)) &&
            void 0 !== t
            ? t
            : "";
        }
      }
      v._snapshoter = null;
    },
    46148: (e, t, o) => {
      var s;
      o.d(t, { CompareOption: () => s }),
        (function (e) {
          (e[(e.SamePctScale = 0)] = "SamePctScale"),
            (e[(e.NewPriceScale = 1)] = "NewPriceScale"),
            (e[(e.NewPane = 2)] = "NewPane"),
            (e[(e.SameScale = 3)] = "SameScale");
        })(s || (s = {}));
    },
  },
]);
