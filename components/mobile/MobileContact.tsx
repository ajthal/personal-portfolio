"use client";

import React from "react";
import { Icon } from "@/components/icons/Icon";
import { CHARACTER } from "@/lib/data";
import { Audio$ } from "@/lib/audio";

export default function MobileContact() {
  const rows = CHARACTER.contacts;
  return (
    <div>
      <div className="m-screen-header">
        <div className="badge"><Icon.Mail size={32} /></div>
        <div>
          <h1>Covenants</h1>
          <div className="sub">Channels by which I may be summoned.</div>
        </div>
      </div>

      <div className="m-frame">
        <div className="m-flavor">
          &quot;Swear an oath at any one of these shrines, and a reply shall come in due time.&quot;
        </div>
        <div className="rule-h" style={{ margin: "12px 0" }} />
        <div className="m-list">
          {rows.map((r, i) => {
            const Ic = Icon[r.icon] || Icon.Scroll;
            return (
              <a
                key={i}
                href={r.href}
                target="_blank"
                rel="noreferrer"
                className="m-card"
                onClick={() => Audio$.select()}
              >
                <div className="m-card-icon"><Ic size={22} /></div>
                <div className="m-card-body">
                  <div className="m-card-title">{r.label}</div>
                  <div className="m-card-sub" style={{ fontStyle: "normal", letterSpacing: ".02em", wordBreak: "break-all" }}>{r.val}</div>
                </div>
              </a>
            );
          })}
        </div>
      </div>

      <div className="m-frame">
        <div className="m-section-h">◆ Seeking</div>
        <div className="stat-row hi"><span className="icn"><Icon.Sword size={15} /></span><span className="label">Role</span><span className="val">Software Engineer</span></div>
        <div className="stat-row"><span className="icn"><Icon.Shield size={15} /></span><span className="label">Location</span><span className="val">Open / Remote</span></div>
        <div className="stat-row"><span className="icn"><Icon.Flame size={15} /></span><span className="label">Status</span><span className="val">Open to work</span></div>
        <div className="stat-row"><span className="icn"><Icon.Scroll size={15} /></span><span className="label">Stack</span><span className="val">Full-stack / product</span></div>
        <div className="rule-h" style={{ margin: "12px 0" }} />
        <div className="m-flavor" style={{ marginBottom: 0 }}>
          If the cause is good and the hearth is warm, I will walk the long road.
        </div>
      </div>
    </div>
  );
}
