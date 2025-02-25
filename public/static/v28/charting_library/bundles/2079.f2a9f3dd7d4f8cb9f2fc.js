(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [2079],
  {
    36136: (e) => {
      e.exports = {
        "nav-button": "nav-button-znwuaSC1",
        link: "link-znwuaSC1",
        background: "background-znwuaSC1",
        icon: "icon-znwuaSC1",
        "flip-icon": "flip-icon-znwuaSC1",
        "size-large": "size-large-znwuaSC1",
        "preserve-paddings": "preserve-paddings-znwuaSC1",
        "size-medium": "size-medium-znwuaSC1",
        "size-small": "size-small-znwuaSC1",
        "size-xsmall": "size-xsmall-znwuaSC1",
        "size-xxsmall": "size-xxsmall-znwuaSC1",
        "visually-hidden": "visually-hidden-znwuaSC1",
      };
    },
    8473: (e) => {
      e.exports = {
        dialog: "dialog-b8SxMnzX",
        wrapper: "wrapper-b8SxMnzX",
        separator: "separator-b8SxMnzX",
        bounded: "bounded-b8SxMnzX",
      };
    },
    80822: (e) => {
      e.exports = {
        "small-height-breakpoint": "screen and (max-height: 360px)",
        container: "container-BZKENkhT",
        unsetAlign: "unsetAlign-BZKENkhT",
        title: "title-BZKENkhT",
        subtitle: "subtitle-BZKENkhT",
        textWrap: "textWrap-BZKENkhT",
        ellipsis: "ellipsis-BZKENkhT",
        close: "close-BZKENkhT",
        icon: "icon-BZKENkhT",
      };
    },
    47625: (e) => {
      e.exports = { separator: "separator-Pf4rIzEt" };
    },
    57340: (e, t, n) => {
      "use strict";
      n.d(t, { CloseButton: () => d });
      var r = n(50959),
        o = n(64388),
        i = n(17105),
        s = n(15130),
        l = n(38822),
        a = n(63346),
        c = n(34983);
      function u(e = "large") {
        switch (e) {
          case "large":
            return i;
          case "medium":
          default:
            return s;
          case "small":
            return l;
          case "xsmall":
            return a;
          case "xxsmall":
            return c;
        }
      }
      const d = r.forwardRef((e, t) =>
        r.createElement(o.NavButton, { ...e, ref: t, icon: u(e.size) }),
      );
    },
    64388: (e, t, n) => {
      "use strict";
      n.d(t, { NavButton: () => c });
      var r = n(50959),
        o = n(97754),
        i = n(9745),
        s = (n(78572), n(36136));
      function l(e) {
        const {
          size: t = "large",
          preservePaddings: n,
          isLink: r,
          flipIconOnRtl: i,
          className: l,
        } = e;
        return o(
          s["nav-button"],
          s[`size-${t}`],
          n && s["preserve-paddings"],
          i && s["flip-icon"],
          r && s.link,
          l,
        );
      }
      function a(e) {
        const { children: t, icon: n } = e;
        return r.createElement(
          r.Fragment,
          null,
          r.createElement("span", { className: s.background }),
          r.createElement(i.Icon, {
            icon: n,
            className: s.icon,
            "aria-hidden": !0,
          }),
          t && r.createElement("span", { className: s["visually-hidden"] }, t),
        );
      }
      const c = (0, r.forwardRef)((e, t) => {
        const {
          icon: n,
          type: o = "button",
          preservePaddings: i,
          flipIconOnRtl: s,
          size: c,
          "aria-label": u,
          ...d
        } = e;
        return r.createElement(
          "button",
          { ...d, className: l({ ...e, children: u }), ref: t, type: o },
          r.createElement(a, { icon: n }, u),
        );
      });
      c.displayName = "NavButton";
      var u = n(21593),
        d = n(53017);
      (0, r.forwardRef)((e, t) => {
        const { icon: n, renderComponent: o, "aria-label": i, ...s } = e,
          c = null != o ? o : u.CustomComponentDefaultLink;
        return r.createElement(
          c,
          {
            ...s,
            className: l({ ...e, children: i, isLink: !0 }),
            reference: (0, d.isomorphicRef)(t),
          },
          r.createElement(a, { icon: n }, i),
        );
      }).displayName = "NavAnchorButton";
    },
    78572: (e, t, n) => {
      "use strict";
      var r, o, i, s;
      !(function (e) {
        (e.Primary = "primary"),
          (e.QuietPrimary = "quiet-primary"),
          (e.Secondary = "secondary"),
          (e.Ghost = "ghost");
      })(r || (r = {})),
        (function (e) {
          (e.XXSmall = "xxsmall"),
            (e.XSmall = "xsmall"),
            (e.Small = "small"),
            (e.Medium = "medium"),
            (e.Large = "large"),
            (e.XLarge = "xlarge"),
            (e.XXLarge = "xxlarge");
        })(o || (o = {})),
        (function (e) {
          (e.Brand = "brand"),
            (e.Gray = "gray"),
            (e.LightGray = "light-gray"),
            (e.Green = "green"),
            (e.Red = "red"),
            (e.Black = "black"),
            (e.Gradient = "gradient"),
            (e.BlackFriday = "black-friday"),
            (e.CyberMonday = "cyber-monday");
        })(i || (i = {})),
        (function (e) {
          (e.Semibold18px = "semibold18px"),
            (e.Semibold16px = "semibold16px"),
            (e.Semibold14px = "semibold14px"),
            (e.Medium16px = "medium16px"),
            (e.Regular16px = "regular16px"),
            (e.Regular14px = "regular14px");
        })(s || (s = {}));
    },
    86332: (e, t, n) => {
      "use strict";
      n.d(t, { ControlGroupContext: () => r });
      const r = n(50959).createContext({
        isGrouped: !1,
        cellState: { isTop: !0, isRight: !0, isBottom: !0, isLeft: !0 },
      });
    },
    38952: (e, t, n) => {
      "use strict";
      function r(e) {
        const { reference: t, ...n } = e;
        return { ...n, ref: t };
      }
      n.d(t, { renameRef: () => r });
    },
    21593: (e, t, n) => {
      "use strict";
      n.d(t, { CustomComponentDefaultLink: () => i });
      var r = n(50959),
        o = n(38952);
      function i(e) {
        return r.createElement("a", { ...(0, o.renameRef)(e) });
      }
      r.PureComponent;
    },
    66686: (e, t, n) => {
      "use strict";
      n.d(t, {
        useComposedKeyboardActionHandlers: () => l,
        useKeyboardActionHandler: () => s,
        useKeyboardClose: () => u,
        useKeyboardEventHandler: () => a,
        useKeyboardOpen: () => d,
        useKeyboardToggle: () => c,
      });
      var r = n(50959),
        o = n(3343);
      const i = () => !0;
      function s(e, t, n = i, o) {
        return (0, r.useCallback)(
          (r) => {
            if (o) {
              if ("horizontal" === o && (40 === r || 38 === r)) return;
              if ("vertical" === o && (37 === r || 39 === r)) return;
            }
            const i = e.map((e) => ("function" == typeof e ? e() : e));
            return !(!n(r) || !i.includes(r)) && (t(r), !0);
          },
          [...e, t, n],
        );
      }
      function l(...e) {
        return (0, r.useCallback)(
          (t) => {
            for (const n of e) if (n(t)) return !0;
            return !1;
          },
          [...e],
        );
      }
      function a(e, t = !0) {
        const n = l(...e);
        return (0, r.useCallback)(
          (e) => {
            n((0, o.hashFromEvent)(e)) && t && e.preventDefault();
          },
          [n],
        );
      }
      function c(e, t = !0) {
        return s([13, 32], e, function (e) {
          if (13 === e) return t;
          return !0;
        });
      }
      function u(e, t) {
        return s(
          [9, (0, r.useCallback)(() => o.Modifiers.Shift + 9, []), 27],
          t,
          (0, r.useCallback)(() => e, [e]),
        );
      }
      function d(e, t) {
        return s(
          [40, 38],
          t,
          (0, r.useCallback)(() => !e, [e]),
        );
      }
    },
    7953: (e, t, n) => {
      "use strict";
      n.d(t, { useDisclosure: () => c });
      var r = n(50959),
        o = n(50151),
        i = n(54717),
        s = n(29202),
        l = n(47201),
        a = n(22064);
      function c(e) {
        const {
            id: t,
            listboxId: n,
            disabled: c,
            buttonTabIndex: u = 0,
            onFocus: d,
            onBlur: p,
            onClick: h,
          } = e,
          [f, m] = (0, r.useState)(!1),
          [g, b] = (0, s.useFocus)(),
          v = g || f,
          C = (null != n ? n : void 0 !== t)
            ? (0, a.createDomId)(t, "listbox")
            : void 0,
          w = (0, r.useRef)(null),
          x = (0, r.useCallback)(
            (e) => {
              var t;
              return null === (t = w.current) || void 0 === t
                ? void 0
                : t.focus(e);
            },
            [w],
          ),
          S = (0, r.useRef)(null),
          y = (0, r.useCallback)(
            () => (0, o.ensureNotNull)(S.current).focus(),
            [S],
          ),
          _ = (0, r.useCallback)(() => m(!0), [m]),
          k = (0, r.useCallback)(
            (e = !1, t = !1) => {
              m(!1);
              const { activeElement: n } = document;
              (n && (0, i.isTextEditingField)(n)) ||
                t ||
                x({ preventScroll: e });
            },
            [m, x],
          ),
          E = (0, r.useCallback)(() => {
            f ? k() : _();
          }, [f, k, _]),
          z = c ? [] : [d, b.onFocus],
          N = c ? [] : [p, b.onBlur],
          B = c ? [] : [h, E],
          O = (0, l.createSafeMulticastEventHandler)(...z),
          R = (0, l.createSafeMulticastEventHandler)(...N),
          K = (0, l.createSafeMulticastEventHandler)(...B);
        return {
          listboxId: C,
          isOpened: f,
          isFocused: v,
          buttonTabIndex: c ? -1 : u,
          listboxTabIndex: -1,
          open: _,
          close: k,
          toggle: E,
          onOpen: y,
          buttonFocusBindings: { onFocus: O, onBlur: R },
          onButtonClick: K,
          buttonRef: w,
          listboxRef: S,
          buttonAria: {
            "aria-controls": f ? C : void 0,
            "aria-expanded": f,
            "aria-disabled": c,
          },
        };
      }
    },
    29202: (e, t, n) => {
      "use strict";
      n.d(t, { useFocus: () => o });
      var r = n(50959);
      function o(e, t) {
        const [n, o] = (0, r.useState)(!1);
        (0, r.useEffect)(() => {
          t && n && o(!1);
        }, [t, n]);
        const i = {
          onFocus: (0, r.useCallback)(
            function (t) {
              (void 0 !== e && e.current !== t.target) || o(!0);
            },
            [e],
          ),
          onBlur: (0, r.useCallback)(
            function (t) {
              (void 0 !== e && e.current !== t.target) || o(!1);
            },
            [e],
          ),
        };
        return [n, i];
      }
    },
    36762: (e, t, n) => {
      "use strict";
      n.d(t, { useItemsKeyboardNavigation: () => l });
      var r,
        o = n(50959),
        i = n(66686);
      function s(e, t) {
        return e >= 0 ? e % t : (t - (Math.abs(e) % t)) % t;
      }
      !(function (e) {
        (e.Next = "next"),
          (e.Previous = "previous"),
          (e.First = "first"),
          (e.Last = "last");
      })(r || (r = {}));
      function l(e, t, n, r, l, a, c = {}, u) {
        const d = (0, o.useCallback)(
            (e) => {
              const t = n.findIndex(r);
              if (t === n.length - 1 && !a)
                return void (
                  (null == u ? void 0 : u.onFailNext) && u.onFailNext(e)
                );
              const o = s(t + 1, n.length);
              l && l(n[o], "next");
            },
            [n, r, l, a],
          ),
          p = (0, o.useCallback)(
            (e) => {
              const t = n.findIndex(r);
              if (0 === t && !a)
                return void (
                  (null == u ? void 0 : u.onFailPrev) && u.onFailPrev(e)
                );
              const o = s(t - 1, n.length);
              l && l(n[o], "previous");
            },
            [n, r, l, a],
          ),
          h = (0, o.useCallback)(() => {
            l && l(n[0], "first");
          }, [l, n]),
          f = (0, o.useCallback)(() => {
            l && l(n[n.length - 1], "last");
          }, [l, n]),
          m = (0, o.useMemo)(
            () =>
              ((e) => ({
                next: [40, () => (e() ? 37 : 39)],
                previous: [38, () => (e() ? 39 : 37)],
                first: [33, () => (e() ? 35 : 36)],
                last: [34, () => (e() ? 36 : 35)],
              }))(t),
            [t],
          ),
          {
            next: g = m.next,
            previous: b = m.previous,
            first: v = m.first,
            last: C = m.last,
          } = c;
        return (0, i.useComposedKeyboardActionHandlers)(
          (0, i.useKeyboardActionHandler)(g, d, () => !0, e),
          (0, i.useKeyboardActionHandler)(b, p, () => !0, e),
          (0, i.useKeyboardActionHandler)(v, h, () => !0, e),
          (0, i.useKeyboardActionHandler)(C, f, () => !0, e),
        );
      }
    },
    16921: (e, t, n) => {
      "use strict";
      n.d(t, { useKeepActiveItemIntoView: () => d });
      var r = n(50959),
        o = n(50151),
        i = n(74991);
      const s = { duration: 200, additionalScroll: 0 },
        l = {
          vertical: {
            scrollSize: "scrollHeight",
            clientSize: "clientHeight",
            start: "top",
            end: "bottom",
            size: "height",
          },
          horizontal: {
            scrollSize: "scrollWidth",
            clientSize: "clientWidth",
            start: "left",
            end: "right",
            size: "width",
          },
        };
      function a(e, t) {
        const n = l[e];
        return t[n.scrollSize] > t[n.clientSize];
      }
      function c(e, t, n, r, o, s) {
        const a = (function (e, t, n, r = 0) {
          const o = l[e];
          return {
            start: -1 * r,
            middle:
              -1 * (Math.floor(n[o.size] / 2) - Math.floor(t[o.size] / 2)),
            end: -1 * (n[o.size] - t[o.size]) + r,
          };
        })(e, r, o, s.additionalScroll);
        let c = 0;
        if (
          s.snapToMiddle ||
          (function (e, t, n) {
            const r = l[e];
            return (
              t[r.start] < n[r.start] - n[r.size] / 2 ||
              t[r.end] > n[r.end] + n[r.size] / 2
            );
          })(e, r, o)
        )
          c = a.middle;
        else {
          const t = (function (e, t, n, r = 0) {
              const o = l[e],
                i = t[o.start] + Math.floor(t[o.size] / 2),
                s = n[o.start] + Math.floor(n[o.size] / 2);
              return {
                start: t[o.start] - n[o.start] - r,
                middle: i - s,
                end: t[o.end] - n[o.end] + r,
              };
            })(e, r, o, s.additionalScroll),
            n = (function (e) {
              const { start: t, middle: n, end: r } = e,
                o = new Map([
                  [Math.abs(t), { key: "start", value: Math.sign(t) }],
                  [Math.abs(n), { key: "middle", value: Math.sign(n) }],
                  [Math.abs(r), { key: "end", value: Math.sign(r) }],
                ]),
                i = Math.min(...o.keys());
              return o.get(i);
            })(t);
          c = void 0 !== n ? a[n.key] : 0;
        }
        return (
          s.align && (c = a[s.align]),
          (function (e) {
            const {
              additionalScroll: t = 0,
              duration: n = i.dur,
              func: r = i.easingFunc.easeInOutCubic,
              onScrollEnd: o,
              target: s,
              wrap: l,
              direction: a = "vertical",
            } = e;
            let { targetRect: c, wrapRect: u } = e;
            (c = null != c ? c : s.getBoundingClientRect()),
              (u = null != u ? u : l.getBoundingClientRect());
            const d = ("vertical" === a ? c.top - u.top : c.left - u.left) + t,
              p = "vertical" === a ? "scrollTop" : "scrollLeft",
              h = l ? l[p] : 0;
            let f,
              m = 0;
            return (
              (m = window.requestAnimationFrame(function e(t) {
                let i;
                if ((f ? (i = t - f) : ((i = 0), (f = t)), i >= n))
                  return (l[p] = h + d), void (o && o());
                const s = h + d * r(i / n);
                (l[p] = Math.floor(s)), (m = window.requestAnimationFrame(e));
              })),
              function () {
                window.cancelAnimationFrame(m), o && o();
              }
            );
          })({
            ...s,
            target: t,
            targetRect: r,
            wrap: n,
            wrapRect: o,
            additionalScroll: c,
            direction: e,
          })
        );
      }
      class u {
        constructor(e = null) {
          (this._container = null),
            (this._lastScrolledElement = null),
            (this._stopVerticalScroll = null),
            (this._stopHorizontalScroll = null),
            (this._container = e);
        }
        scrollTo(e, t = s) {
          if (
            null !== this._container &&
            null !== e &&
            !(function (e, t, n = 0) {
              const r = e.getBoundingClientRect(),
                o = t.getBoundingClientRect();
              return (
                r.top - o.top >= 0 &&
                o.bottom - r.bottom >= 0 &&
                r.left - o.left >= n &&
                o.right - r.right >= n
              );
            })(e, this._container, t.visibilityDetectionOffsetInline)
          ) {
            const n = e.getBoundingClientRect(),
              r = this._container.getBoundingClientRect();
            this.stopScroll(),
              a("vertical", this._container) &&
                (this._stopVerticalScroll = c(
                  "vertical",
                  e,
                  this._container,
                  n,
                  r,
                  this._modifyOptions("vertical", t),
                )),
              a("horizontal", this._container) &&
                (this._stopHorizontalScroll = c(
                  "horizontal",
                  e,
                  this._container,
                  n,
                  r,
                  this._modifyOptions("horizontal", t),
                ));
          }
          this._lastScrolledElement = e;
        }
        scrollToLastElement(e) {
          this.scrollTo(this._lastScrolledElement, e);
        }
        stopScroll() {
          null !== this._stopVerticalScroll && this._stopVerticalScroll(),
            null !== this._stopHorizontalScroll && this._stopHorizontalScroll();
        }
        getContainer() {
          return this._container;
        }
        setContainer(e) {
          var t;
          (this._container = e),
            (null === (t = this._container) || void 0 === t
              ? void 0
              : t.contains(this._lastScrolledElement)) ||
              (this._lastScrolledElement = null);
        }
        destroy() {
          this.stopScroll(),
            (this._container = null),
            (this._lastScrolledElement = null);
        }
        _handleScrollEnd(e) {
          "vertical" === e
            ? (this._stopVerticalScroll = null)
            : (this._stopHorizontalScroll = null);
        }
        _modifyOptions(e, t) {
          return Object.assign({}, t, {
            onScrollEnd: () => {
              this._handleScrollEnd(e),
                void 0 !== t.onScrollEnd && t.onScrollEnd();
            },
          });
        }
      }
      function d(e = {}) {
        const { activeItem: t, getKey: n, ...i } = e,
          s = (0, r.useRef)(null),
          l = (0, r.useRef)(new Map()),
          a = (function (e) {
            const t = (0, r.useRef)(null);
            return (
              (0, r.useEffect)(
                () => (
                  (t.current = new u(e)),
                  () => (0, o.ensureNotNull)(t.current).destroy()
                ),
                [],
              ),
              t
            );
          })(s.current),
          c = (0, r.useCallback)(() => {
            null !== a.current &&
              null !== s.current &&
              a.current.getContainer() !== s.current &&
              a.current.setContainer(s.current);
          }, [a, s]),
          d = (0, r.useCallback)(
            (e) => {
              s.current = e;
            },
            [s],
          ),
          p = (0, r.useCallback)(
            (e, t) => {
              const r = n ? n(e) : e;
              t ? l.current.set(r, t) : l.current.delete(r);
            },
            [l, n],
          ),
          h = (0, r.useCallback)(
            (e, t) => {
              if (!e) return;
              const r = n ? n(e) : e,
                i = l.current.get(r);
              i && (c(), (0, o.ensureNotNull)(a.current).scrollTo(i, t));
            },
            [l, a, n],
          );
        return (0, r.useEffect)(() => h(t, i), [h, t]), [d, p, h];
      }
    },
    38528: (e, t, n) => {
      "use strict";
      n.d(t, { useMergedRefs: () => i });
      var r = n(50959),
        o = n(53017);
      function i(e) {
        return (0, r.useCallback)((0, o.mergeRefs)(e), e);
      }
    },
    22064: (e, t, n) => {
      "use strict";
      n.d(t, { createDomId: () => a, joinDomIds: () => c });
      const r = /\s/g;
      function o(e) {
        return "string" == typeof e;
      }
      function i(e) {
        switch (typeof e) {
          case "string":
            return e;
          case "number":
          case "bigint":
            return e.toString(10);
          case "boolean":
          case "symbol":
            return e.toString();
          default:
            return null;
        }
      }
      function s(e) {
        return e.trim().length > 0;
      }
      function l(e) {
        return e.replace(r, "-");
      }
      function a(...e) {
        const t = e.map(i).filter(o).filter(s).map(l);
        return (t.length > 0 && t[0].startsWith("id_") ? t : ["id", ...t]).join(
          "_",
        );
      }
      function c(...e) {
        return e.map(i).filter(o).filter(s).join(" ");
      }
    },
    79418: (e, t, n) => {
      "use strict";
      n.d(t, { AdaptivePopupDialog: () => N });
      var r = n(50959),
        o = n(50151),
        i = n(97754),
        s = n.n(i),
        l = n(68335),
        a = n(63273),
        c = n(35749),
        u = n(82206),
        d = n(1109),
        p = n(24437),
        h = n(90692),
        f = n(95711);
      var m = n(52092),
        g = n(76422),
        b = n(11542),
        v = n(57340);
      const C = r.createContext({ setHideClose: () => {} });
      var w = n(80822);
      function x(e) {
        const {
            title: t,
            titleTextWrap: o = !1,
            subtitle: i,
            showCloseIcon: l = !0,
            onClose: a,
            onCloseButtonKeyDown: c,
            renderBefore: u,
            renderAfter: d,
            draggable: p,
            className: h,
            unsetAlign: f,
            closeAriaLabel: m = b.t(null, void 0, n(47742)),
            closeButtonReference: g,
          } = e,
          [x, S] = (0, r.useState)(!1);
        return r.createElement(
          C.Provider,
          { value: { setHideClose: S } },
          r.createElement(
            "div",
            { className: s()(w.container, h, (i || f) && w.unsetAlign) },
            u,
            r.createElement(
              "div",
              { "data-dragg-area": p, className: w.title },
              r.createElement(
                "div",
                { className: s()(o ? w.textWrap : w.ellipsis) },
                t,
              ),
              i &&
                r.createElement(
                  "div",
                  { className: s()(w.ellipsis, w.subtitle) },
                  i,
                ),
            ),
            d,
            l &&
              !x &&
              r.createElement(v.CloseButton, {
                className: w.close,
                "data-name": "close",
                "aria-label": m,
                onClick: a,
                onKeyDown: c,
                ref: g,
                size: "medium",
                preservePaddings: !0,
              }),
          ),
        );
      }
      var S = n(53017),
        y = n(90186),
        _ = n(56570),
        k = n(8473);
      const E = { vertical: 20 },
        z = { vertical: 0 };
      class N extends r.PureComponent {
        constructor() {
          super(...arguments),
            (this._controller = null),
            (this._reference = null),
            (this._orientationMediaQuery = null),
            (this._embedResizerOverridesEnabled = _.enabled(
              "embed_resizer_overrides",
            )),
            (this._renderChildren = (e, t) => (
              (this._controller = e),
              this.props.render({
                requestResize: this._requestResize,
                centerAndFit: this._centerAndFit,
                isSmallWidth: t,
              })
            )),
            (this._handleReference = (e) => (this._reference = e)),
            (this._handleCloseBtnClick = () => {
              this.props.onKeyboardClose && this.props.onKeyboardClose(),
                this._handleClose();
            }),
            (this._handleClose = () => {
              this.props.onClose();
            }),
            (this._handleOpen = () => {
              void 0 !== this.props.onOpen &&
                this.props.isOpened &&
                this.props.onOpen(
                  this.props.fullScreen ||
                    window.matchMedia(p.DialogBreakpoints.TabletSmall).matches,
                );
            }),
            (this._handleKeyDown = (e) => {
              if (!e.defaultPrevented) {
                if (
                  (this.props.onKeyDown && this.props.onKeyDown(e),
                  27 === (0, l.hashFromEvent)(e))
                ) {
                  if (e.defaultPrevented) return;
                  if (
                    this.props.forceCloseOnEsc &&
                    this.props.forceCloseOnEsc()
                  )
                    return (
                      this.props.onKeyboardClose &&
                        this.props.onKeyboardClose(),
                      void this._handleClose()
                    );
                  const { activeElement: n } = document;
                  if (null !== n) {
                    if (
                      (e.preventDefault(),
                      "true" === (t = n).getAttribute("data-haspopup") &&
                        "true" !== t.getAttribute("data-expanded"))
                    )
                      return void this._handleClose();
                    const r = this._reference;
                    if (null !== r && (0, c.isTextEditingField)(n))
                      return void r.focus();
                    if (null == r ? void 0 : r.contains(n))
                      return (
                        this.props.onKeyboardClose &&
                          this.props.onKeyboardClose(),
                        void this._handleClose()
                      );
                  }
                }
                var t, n;
                (function (e) {
                  if ("function" == typeof e) return e();
                  return Boolean(e);
                })(this.props.disableTabNavigationContainment) ||
                  ((n = e),
                  [9, l.Modifiers.Shift + 9].includes(
                    (0, l.hashFromEvent)(n),
                  ) && n.stopPropagation());
              }
            }),
            (this._requestResize = () => {
              null !== this._controller && this._controller.recalculateBounds();
            }),
            (this._centerAndFit = () => {
              null !== this._controller && this._controller.centerAndFit();
            }),
            (this._calculatePositionWithOffsets = (e, t) => {
              const n = (0, o.ensureDefined)(
                this.props.fullScreenViewOffsets,
              ).value();
              return {
                top: n.top,
                left: (0, a.isRtl)() ? -n.right : n.left,
                width: t.clientWidth - n.left - n.right,
                height: t.clientHeight - n.top - n.bottom,
              };
            });
        }
        componentDidMount() {
          this.props.ignoreClosePopupsAndDialog ||
            g.subscribe(
              m.CLOSE_POPUPS_AND_DIALOGS_COMMAND,
              this._handleClose,
              null,
            ),
            this._handleOpen(),
            void 0 !== this.props.onOpen &&
              ((this._orientationMediaQuery = window.matchMedia(
                "(orientation: portrait)",
              )),
              this._orientationMediaQuery.addEventListener(
                "change",
                this._handleOpen,
              )),
            this.props.fullScreenViewOffsets &&
              this.props.fullScreen &&
              this.props.fullScreenViewOffsets.subscribe(this._requestResize);
        }
        componentWillUnmount() {
          this.props.ignoreClosePopupsAndDialog ||
            g.unsubscribe(
              m.CLOSE_POPUPS_AND_DIALOGS_COMMAND,
              this._handleClose,
              null,
            ),
            null !== this._orientationMediaQuery &&
              this._orientationMediaQuery.removeEventListener(
                "change",
                this._handleOpen,
              ),
            this.props.fullScreenViewOffsets &&
              this.props.fullScreen &&
              this.props.fullScreenViewOffsets.unsubscribe(this._requestResize);
        }
        focus() {
          (0, o.ensureNotNull)(this._reference).focus();
        }
        getElement() {
          return this._reference;
        }
        contains(e) {
          var t, n;
          return (
            null !==
              (n =
                null === (t = this._reference) || void 0 === t
                  ? void 0
                  : t.contains(e)) &&
            void 0 !== n &&
            n
          );
        }
        render() {
          const {
              className: e,
              wrapperClassName: t,
              headerClassName: n,
              isOpened: o,
              title: i,
              titleTextWrap: l,
              dataName: a,
              onClickOutside: c,
              additionalElementPos: m,
              additionalHeaderElement: g,
              backdrop: b,
              shouldForceFocus: v = !0,
              shouldReturnFocus: C,
              onForceFocus: w,
              showSeparator: _,
              subtitle: N,
              draggable: B = !0,
              fullScreen: O = !1,
              showCloseIcon: R = !0,
              rounded: K = !0,
              isAnimationEnabled: M,
              growPoint: A,
              dialogTooltip: F,
              unsetHeaderAlign: D,
              onDragStart: P,
              dataDialogName: T,
              closeAriaLabel: I,
              containerAriaLabel: H,
              reference: L,
              containerTabIndex: W,
              closeButtonReference: V,
              onCloseButtonKeyDown: X,
              shadowed: G,
              fullScreenViewOffsets: Z,
              fixedBody: q,
              onClick: Q,
            } = this.props,
            j = "after" !== m ? g : void 0,
            U = "after" === m ? g : void 0,
            J = "string" == typeof i ? i : T || "",
            $ = (0, y.filterDataProps)(this.props),
            Y = (0, S.mergeRefs)([this._handleReference, L]);
          return r.createElement(
            h.MatchMedia,
            { rule: p.DialogBreakpoints.SmallHeight },
            (m) =>
              r.createElement(
                h.MatchMedia,
                { rule: p.DialogBreakpoints.TabletSmall },
                (p) =>
                  r.createElement(
                    u.PopupDialog,
                    {
                      rounded: !(p || O) && K,
                      className: s()(k.dialog, O && Z && k.bounded, e),
                      isOpened: o,
                      reference: Y,
                      onKeyDown: this._handleKeyDown,
                      onClickOutside: c,
                      onClickBackdrop: c,
                      fullscreen: p || O,
                      guard: m ? z : E,
                      boundByScreen: p || O,
                      shouldForceFocus: v,
                      onForceFocus: w,
                      shouldReturnFocus: C,
                      backdrop: b,
                      draggable: B,
                      isAnimationEnabled: M,
                      growPoint: A,
                      name: this.props.dataName,
                      dialogTooltip: F,
                      onDragStart: P,
                      containerAriaLabel: H,
                      containerTabIndex: W,
                      calculateDialogPosition:
                        O && Z ? this._calculatePositionWithOffsets : void 0,
                      shadowed: G,
                      fixedBody: q,
                      onClick: Q,
                      ...$,
                    },
                    r.createElement(
                      "div",
                      {
                        className: s()(k.wrapper, t),
                        "data-name": a,
                        "data-dialog-name": J,
                      },
                      void 0 !== i &&
                        r.createElement(x, {
                          draggable: B && !(p || O),
                          onClose: this._handleCloseBtnClick,
                          renderAfter: U,
                          renderBefore: j,
                          subtitle: N,
                          title: i,
                          titleTextWrap: l,
                          showCloseIcon: R,
                          className: n,
                          unsetAlign: D,
                          closeAriaLabel: I,
                          closeButtonReference: V,
                          onCloseButtonKeyDown: X,
                        }),
                      _ &&
                        r.createElement(d.Separator, {
                          className: k.separator,
                        }),
                      r.createElement(f.PopupContext.Consumer, null, (e) =>
                        this._renderChildren(e, p || O),
                      ),
                    ),
                  ),
              ),
          );
        }
      }
    },
    4523: (e, t, n) => {
      "use strict";
      n.d(t, { PopupMenuDisclosureView: () => u });
      var r = n(50959),
        o = n(20520),
        i = n(50151);
      const s = { x: 0, y: 0 };
      function l(e, t, n) {
        return (0, r.useCallback)(
          () =>
            (function (e, t, { x: n = s.x, y: r = s.y } = s) {
              const o = (0, i.ensureNotNull)(e).getBoundingClientRect(),
                l = {
                  x: o.left + n,
                  y: o.top + o.height + r,
                  indentFromWindow: { top: 4, bottom: 4, left: 4, right: 4 },
                };
              return t && (l.overrideWidth = o.width), l;
            })(e.current, t, n),
          [e, t],
        );
      }
      var a = n(86240);
      const c = parseInt(a["size-header-height"]);
      function u(e) {
        const {
            button: t,
            popupChildren: n,
            buttonRef: i,
            listboxId: s,
            listboxClassName: a,
            listboxTabIndex: u,
            matchButtonAndListboxWidths: d,
            isOpened: p,
            scrollWrapReference: h,
            listboxReference: f,
            onClose: m,
            onOpen: g,
            onListboxFocus: b,
            onListboxBlur: v,
            onListboxKeyDown: C,
            listboxAria: w,
            repositionOnScroll: x = !0,
            closeOnHeaderOverlap: S = !1,
            popupPositionCorrection: y = { x: 0, y: 0 },
            popupPosition: _,
          } = e,
          k = l(i, d, y),
          E = S ? c : 0;
        return r.createElement(
          r.Fragment,
          null,
          t,
          r.createElement(
            o.PopupMenu,
            {
              ...w,
              id: s,
              className: a,
              tabIndex: u,
              isOpened: p,
              position: _ || k,
              repositionOnScroll: x,
              onClose: m,
              onOpen: g,
              doNotCloseOn: i.current,
              reference: f,
              scrollWrapReference: h,
              onFocus: b,
              onBlur: v,
              onKeyDown: C,
              closeOnScrollOutsideOffset: E,
            },
            n,
          ),
        );
      }
    },
    26597: (e, t, n) => {
      "use strict";
      n.d(t, {
        useKeyboardActionHandler: () => r.useKeyboardActionHandler,
        useKeyboardClose: () => r.useKeyboardClose,
        useKeyboardEventHandler: () => r.useKeyboardEventHandler,
        useKeyboardOpen: () => r.useKeyboardOpen,
        useKeyboardToggle: () => r.useKeyboardToggle,
      });
      var r = n(66686);
    },
    1109: (e, t, n) => {
      "use strict";
      n.d(t, { Separator: () => s });
      var r = n(50959),
        o = n(97754),
        i = n(47625);
      function s(e) {
        return r.createElement("div", {
          className: o(i.separator, e.className),
        });
      }
    },
    2948: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M3.92 7.83 9 12.29l5.08-4.46-1-1.13L9 10.29l-4.09-3.6-.99 1.14Z"/></svg>';
    },
    17105: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path stroke="currentColor" stroke-width="1.2" d="m1.5 1.5 21 21m0-21-21 21"/></svg>';
    },
    15130: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path stroke="currentColor" stroke-width="1.2" d="m1.5 1.5 15 15m0-15-15 15"/></svg>';
    },
    38822: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" width="14" height="14"><path stroke="currentColor" stroke-width="1.2" d="m1.5 1.5 11 11m0-11-11 11"/></svg>';
    },
    63346: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" width="12" height="12"><path stroke="currentColor" stroke-width="1.2" d="m1.5 1.5 9 9m0-9-9 9"/></svg>';
    },
    34983: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10" width="10" height="10"><path stroke="currentColor" stroke-width="1.2" d="m1.5 1.5 7 7m0-7-7 7"/></svg>';
    },
    86240: (e) => {
      "use strict";
      e.exports = JSON.parse(
        '{"size-header-height":"64px","media-phone-vertical":"screen and (max-width: 479px)","media-mf-phone-landscape":"screen and (min-width: 568px)"}',
      );
    },
  },
]);
