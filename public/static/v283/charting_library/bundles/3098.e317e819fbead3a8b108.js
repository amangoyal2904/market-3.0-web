(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [3098],
  {
    3196: (e) => {
      e.exports = {
        "tv-circle-logo": "tv-circle-logo-PsAlMQQF",
        "tv-circle-logo--xxxsmall": "tv-circle-logo--xxxsmall-PsAlMQQF",
        "tv-circle-logo--xxsmall": "tv-circle-logo--xxsmall-PsAlMQQF",
        "tv-circle-logo--xsmall": "tv-circle-logo--xsmall-PsAlMQQF",
        "tv-circle-logo--small": "tv-circle-logo--small-PsAlMQQF",
        "tv-circle-logo--medium": "tv-circle-logo--medium-PsAlMQQF",
        "tv-circle-logo--large": "tv-circle-logo--large-PsAlMQQF",
        "tv-circle-logo--xlarge": "tv-circle-logo--xlarge-PsAlMQQF",
        "tv-circle-logo--xxlarge": "tv-circle-logo--xxlarge-PsAlMQQF",
        "tv-circle-logo--xxxlarge": "tv-circle-logo--xxxlarge-PsAlMQQF",
        "tv-circle-logo--visually-hidden":
          "tv-circle-logo--visually-hidden-PsAlMQQF",
      };
    },
    53330: (e) => {
      e.exports = {
        "tablet-normal-breakpoint": "screen and (max-width: 768px)",
        "small-height-breakpoint": "screen and (max-height: 360px)",
        "tablet-small-breakpoint": "screen and (max-width: 430px)",
      };
    },
    2908: (e) => {
      e.exports = {
        "tablet-small-breakpoint": "screen and (max-width: 430px)",
        item: "item-jFqVJoPk",
        hovered: "hovered-jFqVJoPk",
        isDisabled: "isDisabled-jFqVJoPk",
        isActive: "isActive-jFqVJoPk",
        shortcut: "shortcut-jFqVJoPk",
        toolbox: "toolbox-jFqVJoPk",
        withIcon: "withIcon-jFqVJoPk",
        "round-icon": "round-icon-jFqVJoPk",
        icon: "icon-jFqVJoPk",
        labelRow: "labelRow-jFqVJoPk",
        label: "label-jFqVJoPk",
        showOnHover: "showOnHover-jFqVJoPk",
        "disclosure-item-circle-logo": "disclosure-item-circle-logo-jFqVJoPk",
        showOnFocus: "showOnFocus-jFqVJoPk",
      };
    },
    46740: (e) => {
      e.exports = { "link-item": "link-item-zMVwkifW" };
    },
    28881: (e) => {
      e.exports = {
        "round-tab-button": "round-tab-button-JbssaNvk",
        "disable-focus-outline": "disable-focus-outline-JbssaNvk",
        "enable-cursor-pointer": "enable-cursor-pointer-JbssaNvk",
        "size-large": "size-large-JbssaNvk",
        "with-start-icon": "with-start-icon-JbssaNvk",
        "icon-only": "icon-only-JbssaNvk",
        "with-end-icon": "with-end-icon-JbssaNvk",
        "start-icon-wrap": "start-icon-wrap-JbssaNvk",
        "end-icon-wrap": "end-icon-wrap-JbssaNvk",
        "size-small": "size-small-JbssaNvk",
        "size-xsmall": "size-xsmall-JbssaNvk",
        "variant-primary": "variant-primary-JbssaNvk",
        selected: "selected-JbssaNvk",
        "disable-active-state-styles": "disable-active-state-styles-JbssaNvk",
        "variant-ghost": "variant-ghost-JbssaNvk",
        fake: "fake-JbssaNvk",
        caret: "caret-JbssaNvk",
        "visually-hidden": "visually-hidden-JbssaNvk",
      };
    },
    61944: (e) => {
      e.exports = {
        "scroll-wrap": "scroll-wrap-vgCB17hK",
        "overflow-scroll": "overflow-scroll-vgCB17hK",
        "round-tabs": "round-tabs-vgCB17hK",
        "overflow-wrap": "overflow-wrap-vgCB17hK",
        "align-start": "align-start-vgCB17hK",
        "align-center": "align-center-vgCB17hK",
      };
    },
    62794: (e) => {
      e.exports = { icon: "icon-WB2y0EnP", dropped: "dropped-WB2y0EnP" };
    },
    53885: (e, t, n) => {
      "use strict";
      n.d(t, { getStyleClasses: () => o, isCircleLogoWithUrlProps: () => s });
      var i = n(97754),
        a = n(3196),
        l = n.n(a);
      function o(e, t) {
        return i(l()["tv-circle-logo"], l()[`tv-circle-logo--${e}`], t);
      }
      function s(e) {
        return (
          "logoUrl" in e &&
          null !== e.logoUrl &&
          void 0 !== e.logoUrl &&
          0 !== e.logoUrl.length
        );
      }
    },
    17946: (e, t, n) => {
      "use strict";
      n.d(t, { CustomBehaviourContext: () => i });
      const i = (0, n(50959).createContext)({ enableActiveStateStyles: !0 });
      i.displayName = "CustomBehaviourContext";
    },
    95854: (e, t, n) => {
      "use strict";
      var i;
      n.d(t, { useCollapsible: () => b }),
        (function (e) {
          (e.StartFirst = "start-first"), (e.EndFirst = "end-first");
        })(i || (i = {}));
      var a = n(50959),
        l = n(67842),
        o = n(56073),
        s = n(78869),
        r = n(43010),
        c = n(53017);
      function u(e) {
        const {
            itemsList: t,
            getItemId: n,
            calcVisibleAndHiddenItems: i,
            shouldKeepItemVisible: u,
            onMeasureCallback: b,
            forceUpdate: v = !1,
          } = e,
          [m, h] = (0, s.useRefsMap)(),
          f = (0, a.useRef)(null),
          p = (0, a.useRef)({
            widthsMap: new Map(),
            containerWidth: 0,
            moreButtonWidth: 0,
          }),
          [g, k] = (0, a.useState)({ visible: t, hidden: [] }),
          w = (0, a.useMemo)(
            () => t.reduce((e, t, n) => (u(t) && e.push(n), e), []),
            [t, u],
          ),
          C = (0, a.useCallback)(() => {
            if (p.current.containerWidth) {
              const e = i(p.current, w);
              (function (e, t) {
                return !d(e.visible, t.visible) || !d(e.hidden, t.hidden);
              })(g, e) && k(e);
            }
          }, [p, k, g, w, i]),
          x = (0, a.useCallback)(() => {
            p.current.moreButtonWidth = f.current
              ? (0, o.outerWidth)(f.current, !0)
              : 0;
            const e = new Map(p.current.widthsMap);
            for (const i of t) {
              const t = n(i),
                a = m.current.get(t);
              if (a) {
                const n = (0, o.outerWidth)(a, !0);
                e.set(t, n);
              }
            }
            (p.current.widthsMap = e), b && b();
          }, [p, t, n, m, b]),
          y = (0, a.useRef)(null),
          I = (0, a.useCallback)(
            ([e]) => {
              e.contentRect.width !== p.current.containerWidth &&
                (y.current && cancelAnimationFrame(y.current),
                (p.current.containerWidth = e.contentRect.width),
                (y.current = requestAnimationFrame(() => {
                  C();
                })));
            },
            [p, C],
          ),
          E = (0, a.useRef)(null),
          M = (0, a.useCallback)(
            ([e]) => {
              E.current && cancelAnimationFrame(E.current),
                x(),
                (E.current = requestAnimationFrame(() => {
                  C();
                }));
            },
            [x, C],
          ),
          R = (0, l.useResizeObserver)(M),
          S = (0, l.useResizeObserver)(I),
          A = (0, a.useRef)(null),
          N = (0, c.mergeRefs)([S, A]),
          F = (0, a.useRef)(t),
          B = (0, a.useRef)(!0),
          T = (0, a.useRef)([]);
        return (
          (0, r.useIsomorphicLayoutEffect)(() => {
            (!v && !B.current && d(F.current, t) && d(w, T.current)) ||
              (C(), (B.current = !1), (F.current = t), (T.current = w));
          }, [t, C, w, v]),
          {
            containerRefCallback: N,
            moreButtonRef: f,
            innerContainerRefCallback: R,
            itemsRefs: m,
            setItemRef: h,
            hiddenItems: g.hidden,
            visibleItems: g.visible,
            itemsMeasurements: p,
          }
        );
      }
      function d(e, t) {
        return (
          e.length === t.length && e.reduce((e, n, i) => e && n === t[i], !0)
        );
      }
      function b(e, t, n, l = i.EndFirst) {
        const o = (0, a.useCallback)(
          (n, a) => {
            const o = e.map((e) => {
              var i;
              return null !== (i = n.widthsMap.get(t(e))) && void 0 !== i
                ? i
                : 0;
            });
            return (function ({
              items: e,
              containerWidth: t,
              elementsWidths: n,
              menuItemWidth: a,
              keepVisible: l,
              direction: o,
            }) {
              const s = [...e],
                r = [],
                c = [];
              let u = 0;
              for (const e of n) u += e;
              if (u <= t) return { visible: s, hidden: c };
              const d = [...n];
              if (
                ((u = l.map((e) => d[e]).reduce((e, t) => e + t, 0) + a),
                o === i.EndFirst)
              )
                for (let e = 0; e < s.length; e++)
                  l.includes(e)
                    ? r.push(s[e])
                    : ((u += d[e]), u <= t ? r.push(s[e]) : c.push(s[e]));
              else
                for (let e = s.length - 1; e >= 0; e--)
                  l.includes(e)
                    ? r.unshift(s[e])
                    : ((u += d[e]), u <= t ? r.unshift(s[e]) : c.unshift(s[e]));
              return { visible: r, hidden: c };
            })({
              items: e,
              containerWidth: n.containerWidth,
              elementsWidths: o,
              menuItemWidth: n.moreButtonWidth,
              keepVisible: a,
              direction: l,
            });
          },
          [e],
        );
        return u({
          itemsList: e,
          getItemId: t,
          calcVisibleAndHiddenItems: o,
          shouldKeepItemVisible: n,
        });
      }
    },
    125: (e, t, n) => {
      "use strict";
      n.d(t, { useForceUpdate: () => a });
      var i = n(50959);
      const a = () => {
        const [, e] = (0, i.useReducer)((e) => e + 1, 0);
        return e;
      };
    },
    39416: (e, t, n) => {
      "use strict";
      n.d(t, {
        useFunctionalRefObject: () => l,
      });
      var i = n(50959),
        a = n(43010);
      function l(e) {
        const t = (0, i.useMemo)(
            () =>
              (function (e) {
                const t = (n) => {
                  e(n), (t.current = n);
                };
                return (t.current = null), t;
              })((e) => {
                s.current(e);
              }),
            [],
          ),
          n = (0, i.useRef)(null),
          l = (t) => {
            if (null === t) return o(n.current, t), void (n.current = null);
            n.current !== e && ((n.current = e), o(n.current, t));
          },
          s = (0, i.useRef)(l);
        return (
          (s.current = l),
          (0, a.useIsomorphicLayoutEffect)(() => {
            if (null !== t.current)
              return s.current(t.current), () => s.current(null);
          }, [e]),
          t
        );
      }
      function o(e, t) {
        null !== e && ("function" == typeof e ? e(t) : (e.current = t));
      }
    },
    86781: (e, t, n) => {
      "use strict";
      n.d(t, { useMatchMedia: () => l, useSafeMatchMedia: () => a });
      var i = n(50959);
      function a(e, t = !1) {
        const [n, a] = (0, i.useState)(t);
        return (
          (0, i.useEffect)(() => {
            const t = window.matchMedia(e);
            function n() {
              a(t.matches);
            }
            return (
              n(),
              t.addEventListener("change", n),
              () => {
                t.removeEventListener("change", n);
              }
            );
          }, [e]),
          n
        );
      }
      function l(e) {
        const t = (0, i.useMemo)(() => window.matchMedia(e).matches, []);
        return a(e, t);
      }
    },
    78869: (e, t, n) => {
      "use strict";
      n.d(t, { useRefsMap: () => a });
      var i = n(50959);
      function a() {
        const e = (0, i.useRef)(new Map()),
          t = (0, i.useCallback)(
            (t) => (n) => {
              null !== n ? e.current.set(t, n) : e.current.delete(t);
            },
            [e],
          );
        return [e, t];
      }
    },
    67842: (e, t, n) => {
      "use strict";
      n.d(t, { useResizeObserver: () => o });
      var i = n(50959),
        a = n(43010),
        l = n(39416);
      function o(e, t = []) {
        const { callback: n, ref: o = null } = (function (e) {
            return "function" == typeof e ? { callback: e } : e;
          })(e),
          s = (0, i.useRef)(null),
          r = (0, i.useRef)(n);
        r.current = n;
        const c = (0, l.useFunctionalRefObject)(o),
          u = (0, i.useCallback)(
            (e) => {
              c(e),
                null !== s.current &&
                  (s.current.disconnect(), null !== e && s.current.observe(e));
            },
            [c, s],
          );
        return (
          (0, a.useIsomorphicLayoutEffect)(
            () => (
              (s.current = new ResizeObserver((e, t) => {
                r.current(e, t);
              })),
              c.current && u(c.current),
              () => {
                var e;
                null === (e = s.current) || void 0 === e || e.disconnect();
              }
            ),
            [c, ...t],
          ),
          u
        );
      }
    },
    16212: (e, t, n) => {
      "use strict";
      n.d(t, { useTabs: () => m });
      var i = n(50959),
        a = n(37507),
        l = n(47201),
        o = n(29202),
        s = n(16921),
        r = n(50151),
        c = n(66686),
        u = n(36762);
      function d() {
        return !1;
      }
      function b(e) {
        const { activationType: t = "manual" } = e,
          n = (0, i.useMemo)(() => t, []);
        return (
          (0, r.assert)(t === n, "Activation type must be invariant."),
          "automatic" === t
            ? (function (e) {
                const {
                    isRtl: t,
                    items: n,
                    preventDefaultIfHandled: a = !0,
                    isHighlighted: l,
                    onHighlight: o,
                    onActivate: s,
                    isCollapsed: r = d,
                    orientation: b,
                  } = e,
                  v = (0, i.useCallback)(
                    (e) => {
                      o(e), r(e) || s(e);
                    },
                    [o, s, r],
                  );
                return (0, c.useKeyboardEventHandler)(
                  [(0, u.useItemsKeyboardNavigation)(b, t, n, l, v, !0)],
                  a,
                );
              })(e)
            : (function (e) {
                const {
                    isRtl: t,
                    items: n,
                    preventDefaultIfHandled: a = !0,
                    isHighlighted: l,
                    onHighlight: o,
                    onActivate: s,
                    orientation: r,
                  } = e,
                  d = n.find(l),
                  b = (0, i.useCallback)(() => {
                    void 0 !== d && s(d);
                  }, [d, s]),
                  v = (0, i.useCallback)((e) => o(e), [o]),
                  m = (0, u.useItemsKeyboardNavigation)(r, t, n, l, v, !0),
                  h = (0, c.useKeyboardActionHandler)([13, 32], b);
                return (0, c.useKeyboardEventHandler)([m, h], a);
              })(e)
        );
      }
      var v = n(5325);
      function m(e) {
        var t, n, r;
        const {
            id: c,
            items: u,
            orientation: d,
            activationType: m = "manual",
            disabled: h,
            tablistLabelId: f,
            tablistLabel: p,
            focusOnHighlight: g = !0,
            preventDefaultIfKeyboardActionHandled: k = !0,
            scrollIntoViewOptions: w,
            isActive: C,
            onActivate: x,
            isCollapsed: y,
            isRtl: I,
            isDisclosureOpened: E,
          } = e,
          M = (function () {
            const [e, t] = (0, i.useState)(!1);
            return (
              (0, i.useEffect)(() => {
                t(v.mobiletouch);
              }, []),
              e
            );
          })(),
          R = E ? null : d || "horizontal",
          S = (0, i.useRef)(
            null !==
              (n =
                null === (t = e.itemsRefs) || void 0 === t
                  ? void 0
                  : t.current) && void 0 !== n
              ? n
              : new Map(),
          ),
          [A, N] = (0, i.useState)(),
          [F, B] = (0, o.useFocus)(),
          T = u.find(C),
          O = (0, i.useCallback)((e) => !h && !e.disabled && e === A, [h, A]),
          Q = (0, i.useCallback)(
            (e) => {
              const t = S.current.get(e);
              g && void 0 !== t && t !== document.activeElement && t.focus();
            },
            [g],
          ),
          P = (0, i.useRef)(),
          z = (0, i.useCallback)(
            (e, t) => {
              h ||
                e.disabled ||
                (N(e),
                "number" == typeof t
                  ? (clearTimeout(P.current),
                    (P.current = setTimeout(() => Q(e), t)))
                  : Q(e));
            },
            [h, N, Q],
          ),
          H = (0, i.useCallback)(
            (e) => {
              h || e.disabled || (x(e), O(e) || z(e));
            },
            [h, x, O, z],
          ),
          L = b({
            isRtl: I,
            items: (0, i.useMemo)(
              () => u.filter((e) => !h && !e.disabled),
              [u, h],
            ),
            activationType: m,
            preventDefaultIfHandled: k,
            onActivate: H,
            isHighlighted: O,
            onHighlight: z,
            isCollapsed: y,
            orientation: R,
          }),
          W = (0, i.useCallback)(
            (e) => {
              let t = null;
              for (const [n, i] of S.current.entries())
                if (e.target === i) {
                  t = n;
                  break;
                }
              t && !O(t) && ("automatic" === m && y && !y(t) ? H(t) : z(t));
            },
            [m, O, z, H, y],
          );
        (0, i.useEffect)(() => {
          M || (void 0 !== T && N(T));
        }, [T, M]),
          (0, i.useEffect)(() => {
            F || N(void 0);
          }, [F]),
          (0, i.useEffect)(() => () => clearTimeout(P.current), []);
        const D =
            null !== (r = null == w ? void 0 : w.additionalScroll) &&
            void 0 !== r
              ? r
              : 0,
          [U, J] = (0, s.useKeepActiveItemIntoView)({
            ...w,
            visibilityDetectionOffsetInline: D + 24,
            snapToMiddle: !0,
            activeItem: null != A ? A : T,
            getKey: (0, i.useCallback)((e) => e.id, []),
          }),
          V = (0, i.useCallback)(
            (e, t) => {
              J(e, t), null !== t ? S.current.set(e, t) : S.current.delete(e);
            },
            [J],
          ),
          K = u.map((e) => {
            var t, n;
            const i = O(e),
              l = C(e),
              o =
                null !==
                  (n = null !== (t = e.disabled) && void 0 !== t ? t : h) &&
                void 0 !== n &&
                n,
              s = !o && (F ? i : l);
            return {
              ...(0, a.getTabAttributes)(e.id, s, l, e.tabpanelId, o),
              highlighted: i,
              active: l,
              handleItemRef: V,
            };
          });
        return {
          tabsBindings: K,
          tablistBinding: {
            ...(0, a.getTabListAttributes)((0, a.getTablistId)(c), d, h, f, p),
            onBlur: B.onBlur,
            onFocus: (0, l.createSafeMulticastEventHandler)(B.onFocus, W),
            onKeyDown: L,
          },
          scrollWrapBinding: { ref: U },
          onActivate: H,
          onHighlight: z,
          isHighlighted: O,
        };
      }
    },
    37507: (e, t, n) => {
      "use strict";
      n.d(t, {
        getTabAttributes: () => u,
        getTabListAttributes: () => c,
        getTablistId: () => r,
      });
      var i,
        a,
        l,
        o,
        s = n(22064);
      function r(e) {
        return (0, s.createDomId)(e, "tablist");
      }
      function c(e, t = "horizontal", n, i, a) {
        return {
          id: e,
          role: "tablist",
          "aria-orientation": t,
          "aria-label": a,
          "aria-labelledby": i,
          "aria-disabled": n,
        };
      }
      function u(e, t, n, i, a) {
        return {
          id: e,
          role: "tab",
          tabIndex: t ? 0 : -1,
          disabled: a,
          "aria-selected": n,
          "aria-controls": i,
          "aria-disabled": a,
        };
      }
      !(function (e) {
        (e.Horizontal = "horizontal"), (e.Vertical = "vertical");
      })(i || (i = {})),
        (function (e) {
          (e.Automatic = "automatic"), (e.Manual = "manual");
        })(a || (a = {})),
        (function (e) {
          (e.Collapse = "collapse"),
            (e.Scroll = "scroll"),
            (e.Wrap = "wrap"),
            (e.None = "none");
        })(l || (l = {})),
        (function (e) {
          (e.SquareButtonTabs = "square-button-tabs"),
            (e.UnderlineButtonTabs = "underline-button-tabs"),
            (e.UnderlineAnchorTabs = "underline-anchor-tabs"),
            (e.RoundAnchorTabs = "round-anchor-tabs"),
            (e.RoundButtonTabs = "round-button-tabs"),
            (e.LightButtonTabs = "light-button-tabs");
        })(o || (o = {}));
    },
    56073: (e, t, n) => {
      "use strict";
      function i(e, t = !1) {
        const n = getComputedStyle(e),
          i = [n.height];
        return (
          "border-box" !== n.boxSizing &&
            i.push(
              n.paddingTop,
              n.paddingBottom,
              n.borderTopWidth,
              n.borderBottomWidth,
            ),
          t && i.push(n.marginTop, n.marginBottom),
          i.reduce((e, t) => e + (parseFloat(t) || 0), 0)
        );
      }
      function a(e, t = !1) {
        const n = getComputedStyle(e),
          i = [n.width];
        return (
          "border-box" !== n.boxSizing &&
            i.push(
              n.paddingLeft,
              n.paddingRight,
              n.borderLeftWidth,
              n.borderRightWidth,
            ),
          t && i.push(n.marginLeft, n.marginRight),
          i.reduce((e, t) => e + (parseFloat(t) || 0), 0)
        );
      }
      n.d(t, { outerHeight: () => i, outerWidth: () => a });
    },
    47201: (e, t, n) => {
      "use strict";
      function i(...e) {
        return (t) => {
          for (const n of e) void 0 !== n && n(t);
        };
      }
      n.d(t, { createSafeMulticastEventHandler: () => i });
    },
    24437: (e, t, n) => {
      "use strict";
      n.d(t, { DialogBreakpoints: () => a });
      var i = n(53330);
      const a = {
        SmallHeight: i["small-height-breakpoint"],
        TabletSmall: i["tablet-small-breakpoint"],
        TabletNormal: i["tablet-normal-breakpoint"],
      };
    },
    59695: (e, t, n) => {
      "use strict";
      n.d(t, { CircleLogo: () => s, hiddenCircleLogoClass: () => o });
      var i = n(50959),
        a = n(53885),
        l = n(3196);
      const o = n.n(l)()["tv-circle-logo--visually-hidden"];
      function s(e) {
        var t, n;
        const l = (0, a.getStyleClasses)(e.size, e.className),
          o =
            null !== (n = null !== (t = e.alt) && void 0 !== t ? t : e.title) &&
            void 0 !== n
              ? n
              : "";
        return (0, a.isCircleLogoWithUrlProps)(e)
          ? i.createElement("img", {
              className: l,
              crossOrigin: "",
              src: e.logoUrl,
              alt: o,
              title: e.title,
              loading: e.loading,
              "aria-label": e["aria-label"],
              "aria-hidden": e["aria-hidden"],
            })
          : i.createElement(
              "span",
              {
                className: l,
                title: e.title,
                "aria-label": e["aria-label"],
                "aria-hidden": e["aria-hidden"],
              },
              e.placeholderLetter,
            );
      }
    },
    73775: (e, t, n) => {
      "use strict";
      n.d(t, { useDisclosure: () => i.useDisclosure });
      var i = n(7953);
    },
    36947: (e, t, n) => {
      "use strict";
      n.d(t, { useForceUpdate: () => i.useForceUpdate });
      var i = n(125);
    },
    42707: (e, t, n) => {
      "use strict";
      n.d(t, { useSafeMatchMedia: () => i.useSafeMatchMedia });
      var i = n(86781);
    },
    77975: (e, t, n) => {
      "use strict";
      n.d(t, { useWatchedValueReadonly: () => a });
      var i = n(50959);
      const a = (e, t = !1) => {
        const n = "watchedValue" in e ? e.watchedValue : void 0,
          a = "defaultValue" in e ? e.defaultValue : e.watchedValue.value(),
          [l, o] = (0, i.useState)(n ? n.value() : a);
        return (
          (t ? i.useLayoutEffect : i.useEffect)(() => {
            if (n) {
              o(n.value());
              const e = (e) => o(e);
              return n.subscribe(e), () => n.unsubscribe(e);
            }
            return () => {};
          }, [n]),
          l
        );
      };
    },
    16396: (e, t, n) => {
      "use strict";
      n.d(t, {
        DEFAULT_POPUP_MENU_ITEM_THEME: () => u,
        PopupMenuItem: () => b,
      });
      var i = n(50959),
        a = n(97754),
        l = n(51768),
        o = n(59064),
        s = n(59695),
        r = n(76460),
        c = n(2908);
      const u = c;
      function d(e) {
        e.stopPropagation();
      }
      function b(e) {
        const {
            id: t,
            role: n,
            className: u,
            title: b,
            labelRowClassName: v,
            labelClassName: m,
            toolboxClassName: h,
            shortcut: f,
            forceShowShortcuts: p,
            icon: g,
            iconClassname: k,
            isActive: w,
            isDisabled: C,
            isHovered: x,
            appearAsDisabled: y,
            label: I,
            link: E,
            showToolboxOnHover: M,
            showToolboxOnFocus: R,
            target: S,
            rel: A,
            toolbox: N,
            reference: F,
            onMouseOut: B,
            onMouseOver: T,
            onKeyDown: O,
            suppressToolboxClick: Q = !0,
            theme: P = c,
            tabIndex: z,
            tagName: H,
            renderComponent: L,
            roundedIcon: W,
            iconAriaProps: D,
            circleLogo: U,
            dontClosePopup: J,
            onClick: V,
            onClickArg: K,
            trackEventObject: j,
            trackMouseWheelClick: q,
            trackRightClick: G,
            ..._
          } = e,
          $ = (0, i.useRef)(null),
          X = (0, i.useMemo)(
            () =>
              (function (e) {
                function t(t) {
                  const { reference: n, ...a } = t,
                    l = null != e ? e : a.href ? "a" : "div",
                    o =
                      "a" === l
                        ? a
                        : (function (e) {
                            const {
                              download: t,
                              href: n,
                              hrefLang: i,
                              media: a,
                              ping: l,
                              rel: o,
                              target: s,
                              type: r,
                              referrerPolicy: c,
                              ...u
                            } = e;
                            return u;
                          })(a);
                  return i.createElement(l, { ...o, ref: n });
                }
                return (t.displayName = `DefaultComponent(${e})`), t;
              })(H),
            [H],
          ),
          Z = null != L ? L : X;
        return i.createElement(
          Z,
          {
            ..._,
            id: t,
            role: n,
            className: a(u, P.item, g && P.withIcon, {
              [P.isActive]: w,
              [P.isDisabled]: C || y,
              [P.hovered]: x,
            }),
            title: b,
            href: E,
            target: S,
            rel: A,
            reference: function (e) {
              ($.current = e), "function" == typeof F && F(e);
              "object" == typeof F && (F.current = e);
            },
            onClick: function (e) {
              if (C) return;
              j && (0, l.trackEvent)(j.category, j.event, j.label);
              V && V(K, e);
              J ||
                (e.currentTarget.dispatchEvent(
                  new CustomEvent("popup-menu-close-event", {
                    bubbles: !0,
                    detail: {
                      clickType: (0, r.isKeyboardClick)(e)
                        ? "keyboard"
                        : "mouse",
                    },
                  }),
                ),
                (0, o.globalCloseMenu)());
            },
            onContextMenu: function (e) {
              j &&
                G &&
                (0, l.trackEvent)(j.category, j.event, `${j.label}_rightClick`);
            },
            onMouseUp: function (e) {
              if (1 === e.button && E && j) {
                let e = j.label;
                q && (e += "_mouseWheelClick"),
                  (0, l.trackEvent)(j.category, j.event, e);
              }
            },
            onMouseOver: T,
            onMouseOut: B,
            onKeyDown: O,
            tabIndex: z,
          },
          U &&
            i.createElement(s.CircleLogo, {
              ...D,
              className: c["disclosure-item-circle-logo"],
              size: "xxxsmall",
              logoUrl: U.logoUrl,
              placeholderLetter:
                "placeholderLetter" in U ? U.placeholderLetter : void 0,
            }),
          g &&
            i.createElement("span", {
              "aria-label": D && D["aria-label"],
              "aria-hidden": D && Boolean(D["aria-hidden"]),
              className: a(P.icon, W && c["round-icon"], k),
              dangerouslySetInnerHTML: { __html: g },
            }),
          i.createElement(
            "span",
            { className: a(P.labelRow, v) },
            i.createElement("span", { className: a(P.label, m) }, I),
          ),
          (void 0 !== f || p) &&
            i.createElement(
              "span",
              { className: P.shortcut },
              (Y = f) && Y.split("+").join(" + "),
            ),
          void 0 !== N &&
            i.createElement(
              "span",
              {
                onClick: Q ? d : void 0,
                className: a(h, P.toolbox, {
                  [P.showOnHover]: M,
                  [P.showOnFocus]: R,
                }),
              },
              N,
            ),
        );
        var Y;
      }
    },
    89846: (e, t, n) => {
      "use strict";
      n.d(t, { RoundButtonTabs: () => j });
      var i,
        a,
        l,
        o,
        s = n(50959),
        r = n(11542),
        c = (n(37507), n(38528)),
        u = n(95854),
        d = n(47201),
        b = n(73775),
        v = n(16212),
        m = n(26597);
      !(function (e) {
        (e.Primary = "primary"), (e.Ghost = "ghost");
      })(i || (i = {})),
        (function (e) {
          (e.XSmall = "xsmall"), (e.Small = "small"), (e.Large = "large");
        })(a || (a = {})),
        (function (e) {
          (e.Start = "start"), (e.Center = "center");
        })(l || (l = {})),
        (function (e) {
          (e.Text = "text"), (e.Meatballs = "meatballs");
        })(o || (o = {}));
      var h = n(53017),
        f = n(97754),
        p = n.n(f),
        g = n(17946),
        k = n(9745),
        w = n(2948),
        C = n(28881);
      const x = "xsmall",
        y = "primary";
      function I(e) {
        const t = (0, s.useContext)(g.CustomBehaviourContext),
          {
            size: n = "xsmall",
            variant: i = "primary",
            active: a,
            fake: l,
            startIcon: o,
            endIcon: r,
            showCaret: c,
            iconOnly: u,
            anchor: d,
            enableActiveStateStyles: b = t.enableActiveStateStyles,
            disableFocusOutline: v = !1,
            tooltip: m,
          } = e;
        return f(
          C["round-tab-button"],
          C[`size-${n}`],
          C[`variant-${i}`],
          o && C["with-start-icon"],
          (r || c) && C["with-end-icon"],
          u && C["icon-only"],
          a && C.selected,
          l && C.fake,
          d && C["enable-cursor-pointer"],
          !b && C["disable-active-state-styles"],
          v && C["disable-focus-outline"],
          m && "apply-common-tooltip",
        );
      }
      function E(e) {
        const {
          startIcon: t,
          endIcon: n,
          showCaret: i,
          iconOnly: a,
          children: l,
        } = e;
        return s.createElement(
          s.Fragment,
          null,
          t &&
            s.createElement(k.Icon, {
              icon: t,
              className: C["start-icon-wrap"],
              "aria-hidden": !0,
            }),
          l &&
            s.createElement(
              "span",
              { className: f(C.content, a && C["visually-hidden"]) },
              l,
            ),
          ((!a && n) || i) && s.createElement(M, { icon: n, showCaret: i }),
        );
      }
      function M(e) {
        const { icon: t, showCaret: n } = e;
        return s.createElement(k.Icon, {
          className: f(C["end-icon-wrap"], n && C.caret),
          icon: n ? w : t,
          "aria-hidden": !0,
        });
      }
      const R = (0, s.forwardRef)((e, t) => {
        const {
          id: n,
          size: i,
          variant: a,
          active: l,
          fake: o,
          startIcon: r,
          endIcon: c,
          showCaret: u,
          iconOnly: d,
          children: b,
          enableActiveStateStyles: v,
          disableFocusOutline: m,
          tooltip: h,
          ...f
        } = e;
        return s.createElement(
          "button",
          {
            ...f,
            id: n,
            ref: t,
            "data-tooltip": h,
            className: I({
              size: i,
              variant: a,
              active: l,
              fake: o,
              startIcon: r,
              endIcon: c,
              showCaret: u,
              iconOnly: d,
              enableActiveStateStyles: v,
              disableFocusOutline: m,
              tooltip: h,
            }),
          },
          s.createElement(
            E,
            { startIcon: r, endIcon: c, showCaret: u, iconOnly: d },
            b,
          ),
        );
      });
      R.displayName = "RoundTabsBaseButton";
      const S = (0, s.createContext)({
        size: "small",
        variant: "primary",
        isHighlighted: !1,
        isCollapsed: !1,
        disabled: !1,
      });
      function A(e) {
        var t, n, i;
        const {
            item: a,
            highlighted: l,
            handleItemRef: o,
            reference: r,
            onClick: c,
            "aria-disabled": u,
            ...d
          } = e,
          b = (0, s.useCallback)(
            (e) => {
              d.disabled && e.preventDefault(), c && c(a);
            },
            [c, a, d.disabled],
          ),
          v = (0, s.useCallback)(
            (e) => {
              o && o(a, e), (0, h.isomorphicRef)(r)(e);
            },
            [a, o],
          ),
          m = {
            size: null !== (t = d.size) && void 0 !== t ? t : x,
            variant: null !== (n = d.variant) && void 0 !== n ? n : y,
            isHighlighted: Boolean(d.active),
            isCollapsed: !1,
            disabled: null !== (i = d.disabled) && void 0 !== i && i,
          };
        return s.createElement(
          R,
          {
            ...d,
            id: a.id,
            onClick: b,
            ref: v,
            startIcon: a.startIcon,
            endIcon: a.endIcon,
            tooltip: a.tooltip,
          },
          s.createElement(S.Provider, { value: m }, a.children),
        );
      }
      var N = n(16396),
        F = n(4523),
        B = n(16829),
        T = n(89882),
        O = n(2057),
        Q = n(46740);
      function P(e) {
        const {
            disabled: t,
            isOpened: n,
            enableActiveStateStyles: i,
            disableFocusOutline: a,
            fake: l,
            items: o,
            buttonText: r,
            buttonPreset: u = "text",
            buttonRef: d,
            size: b,
            variant: v,
            isAnchorTabs: m,
            isHighlighted: h,
            onButtonClick: f,
            onItemClick: p,
            onClose: g,
          } = e,
          w = (0, s.useRef)(null),
          C = (0, c.useMergedRefs)([d, w]),
          x = "text" === u ? void 0 : "xsmall" === b ? T : O;
        return s.createElement(F.PopupMenuDisclosureView, {
          buttonRef: w,
          listboxTabIndex: -1,
          isOpened: n,
          onClose: g,
          listboxAria: { "aria-hidden": !0 },
          button: s.createElement(
            R,
            {
              "aria-hidden": !0,
              disabled: t,
              active: n,
              onClick: f,
              ref: C,
              tabIndex: -1,
              size: b,
              variant: v,
              startIcon: x,
              showCaret: "text" === u,
              iconOnly: "meatballs" === u,
              enableActiveStateStyles: i,
              disableFocusOutline: a,
              fake: l,
            },
            r,
          ),
          popupChildren: s.createElement(
            s.Fragment,
            null,
            "meatballs" === u &&
              s.createElement(B.ToolWidgetMenuSummary, null, r),
            o.map((e) =>
              s.createElement(N.PopupMenuItem, {
                key: e.id,
                className: m ? Q["link-item"] : void 0,
                onClick: p,
                onClickArg: e,
                isActive: h(e),
                label: s.createElement(
                  z,
                  {
                    isHighlighted: h(e),
                    size: b,
                    variant: v,
                    disabled: e.disabled,
                  },
                  e.children,
                ),
                isDisabled: e.disabled,
                link: "href" in e ? e.href : void 0,
                rel: "rel" in e ? e.rel : void 0,
                target: "target" in e ? e.target : void 0,
                icon: e.startIcon,
                toolbox:
                  e.endIcon && s.createElement(k.Icon, { icon: e.endIcon }),
                renderComponent:
                  "renderComponent" in e ? e.renderComponent : void 0,
                dontClosePopup: !0,
              }),
            ),
          ),
        });
      }
      function z(e) {
        const {
            isHighlighted: t,
            size: n,
            variant: i,
            children: a,
            disabled: l,
          } = e,
          o = {
            size: null != n ? n : x,
            variant: null != i ? i : y,
            isHighlighted: t,
            isCollapsed: !0,
            disabled: null != l && l,
          };
        return s.createElement(S.Provider, { value: o }, a);
      }
      var H = n(42707),
        L = n(32563),
        W = n(86240),
        D = n(61944);
      function U(e) {
        const { overflowBehaviour: t } = e;
        return f(
          D["scroll-wrap"],
          "scroll" === t && D["overflow-scroll"],
          "wrap" === t && D["overflow-wrap"],
        );
      }
      function J(e) {
        const { align: t = "start", overflowBehaviour: n } = e;
        return f(
          D["round-tabs"],
          ("center" !== t || "scroll" !== n) && D[`align-${t}`],
        );
      }
      function V() {
        const [e, t] = (0, s.useState)(!1);
        return (
          (0, s.useEffect)(() => {
            t(L.mobiletouch);
          }, []),
          e
        );
      }
      var K = n(63273);
      function j(e) {
        const {
            id: t,
            items: i,
            children: a,
            activationType: l,
            orientation: o,
            disabled: h,
            moreButtonText: f = r.t(null, void 0, n(37117)),
            moreButtonPreset: g,
            className: k,
            size: w,
            variant: C,
            align: x,
            onActivate: y,
            isActive: I,
            style: E = {},
            overflowBehaviour: M,
            enableActiveStateStyles: R,
            tablistLabelId: S,
            tablistLabel: N,
            "data-name": F = "round-tabs-buttons",
          } = e,
          B = V(),
          T = (function (e) {
            const t = (0, H.useSafeMatchMedia)(
                W["media-mf-phone-landscape"],
                !0,
              ),
              n = V();
            return null != e ? e : n || !t ? "scroll" : "collapse";
          })(M),
          O = (0, s.useRef)(!1),
          Q = (0, s.useCallback)((e) => e.id, []),
          z = (function (e = "xsmall") {
            switch (e) {
              case "small":
                return 8;
              case "xsmall":
                return 4;
              default:
                return 16;
            }
          })(w),
          L = null != R ? R : !B,
          {
            containerRefCallback: D,
            innerContainerRefCallback: j,
            moreButtonRef: q,
            setItemRef: G,
            visibleItems: _,
            hiddenItems: $,
          } = (0, u.useCollapsible)(i, Q, I),
          X = "collapse" === T ? _ : i,
          Z = "collapse" === T ? $ : [],
          Y = (0, s.useCallback)((e) => Z.includes(e), [Z]),
          {
            isOpened: ee,
            open: te,
            close: ne,
            onButtonClick: ie,
          } = (0, b.useDisclosure)({ id: t, disabled: h }),
          {
            tabsBindings: ae,
            tablistBinding: le,
            scrollWrapBinding: oe,
            onActivate: se,
            onHighlight: re,
            isHighlighted: ce,
          } = (0, v.useTabs)({
            id: t,
            items: [...X, ...Z],
            activationType: l,
            orientation: o,
            disabled: h,
            tablistLabelId: S,
            tablistLabel: N,
            scrollIntoViewOptions: { additionalScroll: z },
            onActivate: y,
            isActive: I,
            isCollapsed: Y,
            isRtl: K.isRtl,
            isDisclosureOpened: ee,
          }),
          ue = Z.find(ce),
          de = (0, s.useCallback)(() => {
            const e = i.find(I);
            e && re(e);
          }, [re, I, i]),
          be = (0, s.useCallback)(
            (e) => {
              var t;
              return null !== (t = ae.find((t) => t.id === e.id)) &&
                void 0 !== t
                ? t
                : {};
            },
            [i, ae],
          ),
          ve = (0, s.useCallback)(() => {
            ne(), de(), (O.current = !0);
          }, [ne, de]),
          me = (0, s.useCallback)(() => {
            ue && (se(ue), re(ue, 250));
          }, [se, re, ue]);
        (le.ref = (0, c.useMergedRefs)([le.ref, j])),
          (oe.ref = (0, c.useMergedRefs)([oe.ref, D])),
          (le.onKeyDown = (0, d.createSafeMulticastEventHandler)(
            (0, m.useKeyboardEventHandler)([
              (0, m.useKeyboardClose)(ee, ve),
              (0, m.useKeyboardActionHandler)(
                [13, 32],
                me,
                (0, s.useCallback)(() => Boolean(ue), [ue]),
              ),
            ]),
            le.onKeyDown,
          ));
        const he = (0, s.useCallback)(
            (e) => {
              (O.current = !0), ie(e);
            },
            [O, ie],
          ),
          fe = (0, s.useCallback)(
            (e) => {
              e && se(e);
            },
            [se],
          );
        return (
          (0, s.useEffect)(() => {
            O.current
              ? (O.current = !1)
              : (ue && !ee && te(), !ue && ee && ne());
          }, [ue, ee, te, ne]),
          s.createElement(
            "div",
            {
              ...oe,
              className: p()(U({ overflowBehaviour: T }), k),
              style: { ...E, "--ui-lib-round-tabs-gap": `${z}px` },
              "data-name": F,
            },
            s.createElement(
              "div",
              { ...le, className: J({ align: x, overflowBehaviour: T }) },
              X.map((e) =>
                s.createElement(A, {
                  ...be(e),
                  key: e.id,
                  item: e,
                  onClick: () => se(e),
                  variant: C,
                  size: w,
                  enableActiveStateStyles: L,
                  disableFocusOutline: B,
                  reference: G(Q(e)),
                  ...(e.dataId && { "data-id": e.dataId }),
                }),
              ),
              Z.map((e) =>
                s.createElement(A, {
                  ...be(e),
                  key: e.id,
                  item: e,
                  variant: C,
                  size: w,
                  reference: G(Q(e)),
                  fake: !0,
                }),
              ),
              "collapse" === T &&
                s.createElement(P, {
                  disabled: h,
                  isOpened: ee,
                  items: Z,
                  buttonText: f,
                  buttonPreset: g,
                  buttonRef: q,
                  isHighlighted: ce,
                  onButtonClick: he,
                  onItemClick: fe,
                  onClose: ne,
                  variant: C,
                  size: w,
                  enableActiveStateStyles: L,
                  disableFocusOutline: B,
                  fake: 0 === Z.length,
                }),
              a,
            ),
          )
        );
      }
      n(21593);
    },
    63932: (e, t, n) => {
      "use strict";
      n.d(t, { Spinner: () => o });
      var i = n(50959),
        a = n(97754),
        l = n(58096);
      n(7727);
      function o(e) {
        const t = a(
          e.className,
          "tv-spinner",
          "tv-spinner--shown",
          `tv-spinner--size_${l.spinnerSizeMap[e.size || l.DEFAULT_SIZE]}`,
        );
        return i.createElement("div", {
          className: t,
          style: e.style,
          role: "progressbar",
        });
      }
    },
    10381: (e, t, n) => {
      "use strict";
      n.d(t, { ToolWidgetCaret: () => r });
      var i = n(50959),
        a = n(97754),
        l = n(9745),
        o = n(62794),
        s = n(578);
      function r(e) {
        const { dropped: t, className: n } = e;
        return i.createElement(l.Icon, {
          className: a(n, o.icon, { [o.dropped]: t }),
          icon: s,
        });
      }
    },
    38177: (e) => {
      e.exports = {
        button: "button-GwQQdU8S",
        hover: "hover-GwQQdU8S",
        clicked: "clicked-GwQQdU8S",
        isInteractive: "isInteractive-GwQQdU8S",
        accessible: "accessible-GwQQdU8S",
        isGrouped: "isGrouped-GwQQdU8S",
        isActive: "isActive-GwQQdU8S",
        isOpened: "isOpened-GwQQdU8S",
        isDisabled: "isDisabled-GwQQdU8S",
        text: "text-GwQQdU8S",
        icon: "icon-GwQQdU8S",
        endIcon: "endIcon-GwQQdU8S",
      };
    },
    33532: (e) => {
      e.exports = { title: "title-u3QJgF_p" };
    },
    81348: (e, t, n) => {
      "use strict";
      n.d(t, {
        DEFAULT_TOOL_WIDGET_BUTTON_THEME: () => s,
        ToolWidgetButton: () => r,
      });
      var i = n(50959),
        a = n(97754),
        l = n(9745),
        o = n(38177);
      const s = o,
        r = i.forwardRef((e, t) => {
          const {
              tag: n = "div",
              icon: s,
              endIcon: r,
              isActive: c,
              isOpened: u,
              isDisabled: d,
              isGrouped: b,
              isHovered: v,
              isClicked: m,
              onClick: h,
              text: f,
              textBeforeIcon: p,
              title: g,
              theme: k = o,
              className: w,
              forceInteractive: C,
              inactive: x,
              "data-name": y,
              "data-tooltip": I,
              ...E
            } = e,
            M = a(w, k.button, (g || I) && "apply-common-tooltip", {
              [k.isActive]: c,
              [k.isOpened]: u,
              [k.isInteractive]: (C || Boolean(h)) && !d && !x,
              [k.isDisabled]: Boolean(d || x),
              [k.isGrouped]: b,
              [k.hover]: v,
              [k.clicked]: m,
            }),
            R =
              s &&
              ("string" == typeof s
                ? i.createElement(l.Icon, { className: k.icon, icon: s })
                : i.cloneElement(s, {
                    className: a(k.icon, s.props.className),
                  }));
          return "button" === n
            ? i.createElement(
                "button",
                {
                  ...E,
                  ref: t,
                  type: "button",
                  className: a(M, k.accessible),
                  disabled: d && !x,
                  onClick: h,
                  title: g,
                  "data-name": y,
                  "data-tooltip": I,
                },
                p &&
                  f &&
                  i.createElement(
                    "div",
                    { className: a("js-button-text", k.text) },
                    f,
                  ),
                R,
                !p &&
                  f &&
                  i.createElement(
                    "div",
                    { className: a("js-button-text", k.text) },
                    f,
                  ),
              )
            : i.createElement(
                "div",
                {
                  ...E,
                  ref: t,
                  "data-role": "button",
                  className: M,
                  onClick: d ? void 0 : h,
                  title: g,
                  "data-name": y,
                  "data-tooltip": I,
                },
                p &&
                  f &&
                  i.createElement(
                    "div",
                    { className: a("js-button-text", k.text) },
                    f,
                  ),
                R,
                !p &&
                  f &&
                  i.createElement(
                    "div",
                    { className: a("js-button-text", k.text) },
                    f,
                  ),
                r && i.createElement(l.Icon, { icon: r, className: o.endIcon }),
              );
        });
    },
    16829: (e, t, n) => {
      "use strict";
      n.d(t, { ToolWidgetMenuSummary: () => o });
      var i = n(50959),
        a = n(97754),
        l = n(33532);
      function o(e) {
        return i.createElement(
          "div",
          { className: a(e.className, l.title) },
          e.children,
        );
      }
    },
    89882: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18"><path fill="currentColor" d="M5 9a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm6 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 2a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/></svg>';
    },
    2057: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" width="28" height="28"><path fill="currentColor" d="M9 14a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm8 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm5 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/></svg>';
    },
    578: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 8" width="16" height="8"><path fill="currentColor" d="M0 1.475l7.396 6.04.596.485.593-.49L16 1.39 14.807 0 7.393 6.122 8.58 6.12 1.186.08z"/></svg>';
    },
    69533: (e) => {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none"><path stroke="currentColor" d="M8 5l3.5 3.5L8 12"/></svg>';
    },
  },
]);
