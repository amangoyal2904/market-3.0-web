(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [3030],
  {
    71580: (t) => {
      t.exports = {
        separator: "separator-EI7Qsb2Q",
        scrollable: "scrollable-EI7Qsb2Q",
      };
    },
    29638: (t, e, n) => {
      "use strict";
      n.r(e), n.d(e, { ConfirmInputsDialogRenderer: () => m });
      var i = n(50959),
        o = n(11542),
        s = n(50182),
        l = n(59064),
        r = n(86656),
        u = n(5236),
        a = n(52033),
        c = n(49483),
        p = n(71580);
      function d(t) {
        const {
            title: e,
            confirmInputs: d,
            inputsProperty: f,
            studyMetaInfo: h,
            model: m,
            confirmInputsType: y,
            onCancel: I,
            onSubmit: C,
            onClose: S,
            onStudyInputChange: b,
          } = t,
          [_, v] = (0, i.useState)(!0),
          g = (0, i.useMemo)(function () {
            const t = new a.Delegate();
            return {
              isInputsStudy: !0,
              symbolsResolved: () => t,
              resolvedSymbolInfoBySymbol: () => null,
              tempProperties: f,
            };
          }, []),
          w = (0, i.useRef)(null),
          [D, E] = (0, i.useState)(M());
        return (
          (0, i.useEffect)(() => {
            if (!c.CheckMobile.any() && _ && "symbol" === y && w.current) {
              const t = w.current.querySelector("input");
              t && t.focus();
            }
          }, [_]),
          i.createElement(s.AdaptiveConfirmDialog, {
            dataName: "confirm-inputs-dialog",
            title: e,
            isOpened: _,
            onSubmit: function () {
              C(f.state().inputs), T();
            },
            onCancel: I,
            onClickOutside: T,
            onClose: T,
            render: () =>
              i.createElement(
                i.Fragment,
                null,
                i.createElement("div", { className: p.separator }),
                i.createElement(
                  r.TouchScrollContainer,
                  { className: p.scrollable, onScroll: P },
                  i.createElement(u.InputsTabContent, {
                    reference: w,
                    property: f,
                    studyMetaInfo: h,
                    model: m,
                    study: g,
                    inputs: d,
                    onStudyInputChange: k,
                  }),
                ),
              ),
            defaultActionOnClose: "none",
            submitButtonText: o.t(null, void 0, n(33391)),
            submitButtonDisabled: D,
            submitOnEnterKey: !1,
          })
        );
        function P() {
          l.globalCloseDelegate.fire();
        }
        function T() {
          v(!1), S();
        }
        function M() {
          const { inputs: t } = f.state();
          for (const e of d)
            if ("symbol" === e.type && !e.optional && "" === t[e.id]) return !0;
          return !1;
        }
        function k(t, e) {
          null == b || b(t, e), E(M());
        }
      }
      var f = n(29280),
        h = n(28124);
      class m extends f.DialogRenderer {
        constructor(t, e, n, i, o, s, l, r, u) {
          super(),
            (this._handleClose = () => {
              var t;
              null === (t = this._rootInstance) || void 0 === t || t.unmount(),
                this._setVisibility(!1),
                this._onClose();
            }),
            (this._title = t),
            (this._confirmInputs = e),
            (this._model = s),
            (this._confirmInputsType = i),
            (this._studyMetaInfo = o),
            (this._onSubmit = l),
            (this._onClose = r),
            (this._onStudyInputChange = u),
            (this._inputsProperty = n);
        }
        show() {
          this.visible().value() ||
            ((this._rootInstance = (0, h.createReactRoot)(
              i.createElement(d, {
                title: this._title,
                confirmInputs: this._confirmInputs,
                inputsProperty: this._inputsProperty,
                studyMetaInfo: this._studyMetaInfo,
                model: this._model,
                confirmInputsType: this._confirmInputsType,
                onSubmit: this._onSubmit,
                onCancel: () => {},
                onClose: this._handleClose,
                onStudyInputChange: this._onStudyInputChange,
              }),
              this._container,
            )),
            this._setVisibility(!0));
        }
        hide() {
          this._handleClose();
        }
      }
    },
    73339: (t, e, n) => {
      "use strict";
      n.r(e), n.d(e, { selectInputValuesOnChart: () => u });
      var i = n(50151),
        o = n(19625),
        s = n(11542),
        l = n(78839),
        r = n(928);
      o.colorsPalette["color-cold-gray-500"];
      async function u(t, e, o, u, a) {
        let c;
        const p = (0, l.getInputGroups)(e);
        t.model().model();
        for await (const t of p)
          await d(t).catch((t) => {
            throw new Error(t);
          });
        return { customSourceId: void 0, destPane: c };
        async function d(t) {
          if ((0, l.isGroup)(t))
            if ((0, l.isInputInlines)(t)) {
              const e = (function (t) {
                if (2 !== t.length || t[0].type === t[1].type) return null;
                return "price" === t[0].type
                  ? { price: t[0], time: t[1] }
                  : { price: t[1], time: t[0] };
              })(t.children);
              if (e) {
                const { time: i, price: o } = e,
                  l = i.inline
                    ? s.t(
                        null,
                        {
                          replace: {
                            inputInline: i.inline,
                            studyShortDescription: u,
                          },
                        },
                        n(10679),
                      )
                    : s.t(
                        null,
                        { replace: { studyShortDescription: u } },
                        n(92229),
                      ),
                  r = m(t.id);
                await h(t, "all", null != r ? r : l, i.id, o.id);
              } else for await (const e of t.children) await f(e);
            } else for await (const e of t.children) await d(e);
          else await f(t);
        }
        async function f(t) {
          const e = "time" === t.type,
            i = e ? "time" : "price",
            o = (function () {
              if (t.inline) {
                const e = m(t.inline);
                if (e) return e;
              }
              if (t.tooltip) return t.tooltip;
              const i = t.name
                  ? s.t(
                      null,
                      {
                        replace: {
                          inputTitle: t.name,
                          studyShortDescription: u,
                        },
                      },
                      n(59451),
                    )
                  : s.t(
                      null,
                      { replace: { studyShortDescription: u } },
                      n(60935),
                    ),
                o = t.name
                  ? s.t(
                      null,
                      {
                        replace: {
                          inputTitle: t.name,
                          studyShortDescription: u,
                        },
                      },
                      n(94238),
                    )
                  : s.t(
                      null,
                      { replace: { studyShortDescription: u } },
                      n(24404),
                    );
              return e ? i : o;
            })(),
            l = e ? t.id : void 0,
            r = e ? void 0 : t.id;
          await h(t, i, o, l, r);
        }
        async function h(e, n, s, l, u) {
          const a = await t.requestSelectPoint(
            {
              pointType: n,
              pane: c,
              lineColor: void 0,
              selectPointMode: r.SelectPointMode.Study,
            },
            s,
          );
          void 0 === c && (c = a.pane);
          const p = o.childs().inputs;
          p &&
            (l &&
              (0, i.ensureDefined)(p.child(l)).setValue(
                1e3 * (a.point.time || 0),
              ),
            u && (0, i.ensureDefined)(p.child(u)).setValue(a.point.price));
        }
        function m(t) {
          let e;
          return (
            a
              .filter((e) => e.inline === t)
              .forEach((t) => {
                t.tooltip && (e = t.tooltip);
              }),
            e
          );
        }
      }
    },
  },
]);
