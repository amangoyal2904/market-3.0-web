"use strict";
(self.webpackChunktradingview = self.webpackChunktradingview || []).push([
  [4079],
  {
    40481: (t, e, i) => {
      i.r(e), i.d(e, { GotoDateView: () => f });
      var a = i(50151),
        r = i(86441),
        l = i(19625),
        n = i(11542),
        o = i(68979),
        s = i(63273),
        d = i(85662),
        u = i(15938),
        h = i(75919),
        c = i(7114);
      const _ = n.t(null, void 0, i(36778)),
        g = (0, l.getHexColorByName)("color-cold-gray-100");
      var T;
      !(function (t) {
        (t[(t.VertMargin = 8)] = "VertMargin"),
          (t[(t.ArrowHeight = 4)] = "ArrowHeight"),
          (t[(t.ArrowWidth = 6)] = "ArrowWidth"),
          (t[(t.BarPadding = 5)] = "BarPadding"),
          (t[(t.HorzPadding = 8)] = "HorzPadding"),
          (t[(t.FontSize = 12)] = "FontSize"),
          (t[(t.LineHeight = 9)] = "LineHeight"),
          (t[(t.Radius = 2)] = "Radius");
      })(T || (T = {}));
      class m extends h.MediaCoordinatesPaneRenderer {
        constructor() {
          super(...arguments), (this._data = null);
        }
        setData(t) {
          this._data = t;
        }
        hitTest() {
          return null;
        }
        _drawImpl(t) {
          const e = this._data;
          if (null === e) return;
          const {
              dateString: i,
              timeString: r,
              eod: l,
              point: n,
              direction: h,
            } = e,
            T = Math.round(4.5),
            m = t.context;
          let f,
            x = 0,
            S = 0;
          (m.font = (0, o.makeFont)(12, u.CHART_FONT_FAMILY)),
            l
              ? (f = m.measureText(_).width)
              : ((x = m.measureText(null != i ? i : "").width),
                (S = m.measureText(null != r ? r : "").width),
                (f = Math.max(x, S)));
          const w = r ? 2 : 1,
            N = (0, d.getThemedColor)("color-goto-label-background");
          (m.fillStyle = N), m.translate(n.x, n.y);
          const v = Math.round(-f / 2) - 8,
            p = -9 * h,
            b = p + h * (-17 * w - 8),
            A = Math.round(v + f + 16);
          m.beginPath(),
            m.moveTo(v + 2, b),
            m.lineTo(A - 2, b),
            m.arcTo(A, b, A, b + 2 * h, 2),
            m.lineTo(A, p - 2 * h),
            m.arcTo(A, p, A - 2, p, 2),
            m.lineTo(6, p),
            m.lineTo(0, p + 4 * h),
            m.lineTo(-6, p),
            m.lineTo(v + 2, p),
            m.arcTo(v, p, v, p - 2 * h, 2),
            m.lineTo(v, b + 2 * h),
            m.arcTo(v, b, v + 2, b, 2),
            m.fill(),
            (m.fillStyle = g),
            (m.textBaseline = "middle"),
            (m.textAlign = (0, s.isRtl)() ? "right" : "left");
          const B = Math.min(p, b),
            H = Math.max(p, b);
          if (e.eod) {
            const t = (0, c.calcTextHorizontalShift)(m, f);
            m.fillText(_, v + 8 + t, (B + H) / 2);
          } else {
            const t = v + 8 + (f - x) / 2,
              i = (0, c.calcTextHorizontalShift)(m, x);
            if (
              (m.fillText((0, a.ensureDefined)(e.dateString), t + i, B + T + 8),
              e.timeString)
            ) {
              const t = (0, c.calcTextHorizontalShift)(m, S),
                i = v + 8 + (f - S) / 2;
              m.fillText(e.timeString, i + t, B + 17 * w - T);
            }
          }
        }
      }
      class f {
        constructor(t, e, i = !1) {
          (this._renderer = new m()),
            (this._invalidated = !0),
            (this._data = null),
            (this._doNotShowLastAvailableBar = !1),
            (this._gotoDateResult = e),
            (this._series = t),
            (this._belowBar = i);
        }
        update() {
          this._invalidated = !0;
        }
        doNotShowLastAvailableBar(t) {
          (this._doNotShowLastAvailableBar = t), this.update();
        }
        renderer() {
          return (
            this._invalidated && (this._updateImpl(), (this._invalidated = !1)),
            this._data ? this._renderer : null
          );
        }
        _updateImpl() {
          this._data = null;
          const t = !!this._gotoDateResult.eod;
          if (t && this._doNotShowLastAvailableBar) return;
          const e = this._series.model(),
            i = e.timeScale().timePointToIndex(this._gotoDateResult.timestamp);
          if (null === i) return;
          const l = this._getTargetBar(i);
          if (null === l) return;
          const { bar: n, targetIndex: o } = l,
            s = this._series.firstValue();
          if (null === s) return;
          let d, u;
          const h = this._series.priceScale().isInverted();
          this._belowBar
            ? ((d = 3), (u = h ? 1 : -1))
            : ((d = 2), (u = h ? -1 : 1));
          const c = this._series.priceScale().priceToCoordinate(n[d], s),
            _ = e.timeScale().indexToCoordinate((0, a.ensureNotNull)(o)),
            g = new r.Point(_, c);
          let T, m;
          if (!t) {
            const t = (0, a.ensureNotNull)(
              e.timeScale().indexToUserTime((0, a.ensureNotNull)(o)),
            );
            (T = e.dateFormatter().format(t)),
              this._series.isDWM() || (m = e.timeFormatter().format(t));
          }
          (this._data = {
            point: g,
            direction: u,
            eod: t,
            dateString: T,
            timeString: m,
          }),
            this._renderer.setData(this._data);
        }
        _getTargetBar(t) {
          const e = this._series.bars(),
            i = e.firstIndex(),
            r = e.lastIndex();
          if (null === i || null === r) return null;
          let l,
            n = t;
          return (
            t < i && null !== e.first()
              ? ((n = i), (l = (0, a.ensureNotNull)(e.first()).value))
              : t > r && null !== e.last()
                ? ((n = (0, a.ensureNotNull)(e.lastIndex())),
                  (l = (0, a.ensureNotNull)(e.last()).value))
                : (l = (0, a.ensureNotNull)(e.valueAt(t))),
            { bar: l, targetIndex: n }
          );
        }
      }
    },
  },
]);
