// /lib/generateUserTableCode.ts

import { UserTableConfig } from "./userTableConfig";

function getDensityPadding(density: UserTableConfig["density"]): string {
  if (density === "compact") return "6px 12px";
  if (density === "spacious") return "16px 20px";
  return "10px 16px";
}

export function generateUserTableJSX(config: UserTableConfig): string {
  const pad = getDensityPadding(config.density);

  return `import { useState, useEffect } from "react";
import "./UserTable.css";

const USERS = [
  {
    id: "u1", initials: "JD", name: "Jordan Davis",
    email: "jordan.davis@dataengine.pro", role: "Administrator",
    joined: "12 Mar 2023", lastLogin: "2 mins ago", status: "Active",
    permissions: ["Data Write", "API Management", "Billing View", "User Invite"],
    activity: [
      { time: "10:45 AM", action: "Changed system retention policy to 90 days" },
      { time: "09:12 AM", action: "Logged in from 192.168.1.1" },
    ],
    workspaces: "Global Workspace, Internal Sandbox, Production DB Mirror",
  },
  {
    id: "u2", initials: "MR", name: "Morgan Reed",
    email: "m.reed@partner.net", role: "Editor",
    joined: "28 Jan 2024", lastLogin: "Yesterday", status: "Active",
    permissions: ["Data Write", "API Read"],
    activity: [{ time: "Yesterday", action: "Updated 3 dataset schemas" }],
  },
  {
    id: "u3", initials: "SK", name: "Sam Kim",
    email: "sam.kim@external.io", role: "Viewer",
    joined: "15 Oct 2022", lastLogin: "14 May 2024", status: "Inactive",
    permissions: ["Data Read"], activity: [],
  },
  {
    id: "u4", initials: "LW", name: "Lee Wong",
    email: "lee.w@dataengine.pro", role: "Administrator",
    joined: "03 Aug 2023", lastLogin: "Just now", status: "Active",
    permissions: ["Data Write", "API Management", "User Invite", "Billing Write"],
    activity: [{ time: "Just now", action: "Logged in from 10.0.0.42" }],
    workspaces: "Global Workspace, Production DB Mirror",
  },
  {
    id: "u5", initials: "AP", name: "Alex Park",
    email: "a.park@dataengine.pro", role: "Editor",
    joined: "19 Jun 2024", lastLogin: "3 hours ago", status: "Pending",
    permissions: ["Data Write"],
    activity: [{ time: "Pending", action: "Awaiting MFA setup" }],
  },
];

export default function UserTable({ onUserSelect }) {
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleRows, setVisibleRows] = useState(new Set());

  useEffect(() => {
    setVisibleRows(new Set());
    const timers = USERS.map((u, i) =>
      setTimeout(() => setVisibleRows((prev) => new Set([...prev, u.id])), i * 60)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  const filtered = USERS.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function toggleRow(id) {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleSelect(id) {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
    if (onUserSelect) onUserSelect(id);
  }

  function handleSelectAll(checked) {
    setSelectAll(checked);
    setSelectedRows(checked ? new Set(filtered.map((u) => u.id)) : new Set());
  }

  return (
    <div className="ut-wrap" style={{ width: "${config.tableWidth}px" }}>
      {selectedRows.size > 0 && (
        <div className="ut__bulk-bar">
          <span className="ut__bulk-count">{selectedRows.size} user{selectedRows.size > 1 ? "s" : ""} selected</span>
          <div className="ut__bulk-divider" />
          <button className="ut__bulk-action">✎ Change Role</button>
          <button className="ut__bulk-action ut__bulk-action--danger">✕ Delete</button>
          <button className="ut__bulk-close" onClick={() => { setSelectedRows(new Set()); setSelectAll(false); }}>×</button>
        </div>
      )}

      <div className="ut">
        <div className="ut__toolbar">
          <div className="ut__search-wrap">
            <span className="ut__search-icon">⌕</span>
            <input
              className="ut__search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users…"
            />
          </div>
          <div className="ut__toolbar-actions">
            <button className="ut__btn ut__btn--ghost">↓ Export</button>
            <button className="ut__btn ut__btn--primary">+ Add User</button>
          </div>
        </div>

        <div className="ut__scroll">
          <table className="ut__table">
            <thead>
              <tr>
                <th className="ut__th ut__th--check">
                  <input type="checkbox" checked={selectAll} onChange={(e) => handleSelectAll(e.target.checked)} className="ut__checkbox" />
                </th>
                <th className="ut__th">Name</th>
                <th className="ut__th">Email</th>
                <th className="ut__th">Role</th>
                <th className="ut__th">Last Login</th>
                <th className="ut__th">Status</th>
                <th className="ut__th ut__th--chevron" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((user, i) => {
                const isExpanded = expandedRows.has(user.id);
                const isSelected = selectedRows.has(user.id);
                const isVisible = visibleRows.has(user.id);
                return [
                  <tr
                    key={user.id}
                    className={\`ut__row\${isSelected ? " ut__row--selected" : ""}\${i % 2 === 1 ? " ut__row--stripe" : ""}\`}
                    style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? "translateY(0)" : "translateY(8px)" }}
                    onClick={() => toggleRow(user.id)}
                  >
                    <td className="ut__td ut__td--check" onClick={(e) => e.stopPropagation()}>
                      <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(user.id)} className="ut__checkbox" />
                    </td>
                    <td className="ut__td">
                      <div className="ut__user-cell">
                        <div className="ut__avatar">{user.initials}</div>
                        <div>
                          <div className="ut__name">{user.name}</div>
                          <div className="ut__joined">Joined {user.joined}</div>
                        </div>
                      </div>
                    </td>
                    <td className="ut__td ut__td--muted">{user.email}</td>
                    <td className="ut__td">
                      <span className={\`ut__badge ut__badge--\${user.role.toLowerCase()}\`}>{user.role}</span>
                    </td>
                    <td className="ut__td ut__td--muted">{user.lastLogin}</td>
                    <td className="ut__td">
                      <span className={\`ut__status ut__status--\${user.status.toLowerCase()}\`}>
                        <span className="ut__status-dot" />
                        {user.status}
                      </span>
                    </td>
                    <td className="ut__td ut__td--chevron">
                      <span className={\`ut__chevron\${isExpanded ? " ut__chevron--open" : ""}\`}>›</span>
                    </td>
                  </tr>,
                  isExpanded ? (
                    <tr key={\`\${user.id}-exp\`} className="ut__expanded-row">
                      <td colSpan={7} className="ut__expanded-td">
                        <div className="ut__expanded-inner">
                          <div className="ut__expanded-section">
                            <div className="ut__expanded-label">Permissions &amp; Access</div>
                            <div className="ut__permissions">
                              {user.permissions.map((p) => (
                                <span key={p} className="ut__permission-tag">{p}</span>
                              ))}
                            </div>
                            {user.workspaces && (
                              <>
                                <div className="ut__expanded-label" style={{ marginTop: 12 }}>Workspaces</div>
                                <div className="ut__expanded-text">{user.workspaces}</div>
                              </>
                            )}
                          </div>
                          <div className="ut__expanded-section">
                            <div className="ut__expanded-label">Recent Activity</div>
                            {user.activity.length === 0 ? (
                              <div className="ut__expanded-text ut__expanded-text--empty">No recent activity.</div>
                            ) : (
                              <ul className="ut__activity">
                                {user.activity.map((a, ai) => (
                                  <li key={ai} className="ut__activity-item">
                                    <span className="ut__activity-time">{a.time}</span>
                                    <span className="ut__activity-action">{a.action}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : null,
                ];
              })}
            </tbody>
          </table>
        </div>

        <div className="ut__pagination">
          <span className="ut__pagination-info">Showing <strong>1–5</strong> of <strong>156</strong> users</span>
          <div className="ut__pagination-pages">
            {["‹", "1", "2", "3", "›"].map((p) => (
              <button key={p} className={\`ut__page-btn\${p === "1" ? " ut__page-btn--active" : ""}\`}>{p}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="ut__cards">
        {[
          { icon: "🔒", title: "Security Posture", desc: "88% of users have MFA enabled. 12 pending invites expired." },
          { icon: "⬡", title: "License Utilization", desc: "156 of 200 seats used. 44 more seats available." },
          { icon: "⧖", title: "Session Audits", desc: "No suspicious login attempts in the last 72 hours." },
        ].map((c) => (
          <div key={c.title} className="ut__card">
            <div className="ut__card-header">
              <span className="ut__card-icon">{c.icon}</span>
              <span className="ut__card-title">{c.title}</span>
            </div>
            <p className="ut__card-desc">{c.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
`;
}

export function generateUserTableCSS(config: UserTableConfig): string {
  const pad = getDensityPadding(config.density);

  return `/* UserTable.css — generated by CompForge */

.ut-wrap {
  font-family: 'Instrument Sans', sans-serif;
  font-size: ${config.fontSize}px;
  max-width: 100%;
}

/* ── Bulk Actions Bar ──────────────────────────── */
.ut__bulk-bar {
  display: flex;
  align-items: center;
  gap: 16px;
  background: ${config.bulkBarBackground};
  color: ${config.bulkBarTextColor};
  border: 1px solid ${config.borderColor};
  border-radius: ${config.borderRadius}px ${config.borderRadius}px 0 0;
  padding: 8px 16px;
  margin-bottom: -1px;
}
.ut__bulk-count { font-weight: 700; }
.ut__bulk-divider { width: 1px; height: 16px; background: ${config.borderColor}; }
.ut__bulk-action {
  background: none; border: none;
  color: ${config.bulkBarTextColor};
  cursor: pointer; font-size: ${config.fontSize}px;
  display: flex; align-items: center; gap: 4px;
}
.ut__bulk-action--danger { color: #f87171; }
.ut__bulk-close {
  background: none; border: none;
  color: ${config.bulkBarTextColor};
  cursor: pointer; font-size: 18px; line-height: 1; margin-left: auto;
}

/* ── Table Container ───────────────────────────── */
.ut {
  background: ${config.backgroundColor};
  border: 1px solid ${config.borderColor};
  border-radius: ${config.borderRadius}px;
  overflow: hidden;
  box-shadow: ${config.showShadow ? "0 4px 24px rgba(0,0,0,0.5)" : "none"};
}

/* ── Toolbar ───────────────────────────────────── */
.ut__toolbar {
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
  padding: 12px 16px;
  border-bottom: 1px solid ${config.headerBorderColor};
  background: ${config.headerBackground};
}
.ut__search-wrap { position: relative; }
.ut__search-icon {
  position: absolute; left: 10px; top: 50%; transform: translateY(-50%);
  color: ${config.headerTextColor}; font-size: 14px; pointer-events: none;
}
.ut__search {
  background: ${config.backgroundColor};
  border: 1px solid ${config.borderColor};
  border-radius: 6px;
  padding: 6px 10px 6px 28px;
  color: ${config.rowTextColor};
  font-size: ${config.fontSize}px;
  outline: none;
  width: 200px;
  font-family: inherit;
}
.ut__search::placeholder { color: ${config.rowSubtextColor}; }
.ut__toolbar-actions { display: flex; gap: 8px; }
.ut__btn {
  border-radius: 6px; padding: 6px 14px;
  cursor: pointer; font-size: ${config.fontSize}px; font-family: inherit;
  display: flex; align-items: center; gap: 6px; border: none;
}
.ut__btn--ghost {
  background: ${config.backgroundColor};
  border: 1px solid ${config.borderColor};
  color: ${config.rowSubtextColor};
}
.ut__btn--ghost:hover { color: ${config.rowTextColor}; }
.ut__btn--primary {
  background: ${config.accentColor};
  color: #ffffff; font-weight: 600;
}
.ut__btn--primary:hover { opacity: 0.9; }

/* ── Scroll Wrapper ────────────────────────────── */
.ut__scroll { overflow-x: auto; }

/* ── Table ─────────────────────────────────────── */
.ut__table { width: 100%; border-collapse: collapse; }

.ut__th {
  padding: ${pad};
  background: ${config.headerBackground};
  color: ${config.headerTextColor};
  font-size: 11px; font-weight: 700;
  letter-spacing: 0.06em; text-transform: uppercase;
  border-bottom: 1px solid ${config.headerBorderColor};
  white-space: nowrap;
  text-align: left;
}
.ut__th--check { width: 44px; }
.ut__th--chevron { width: 40px; }

.ut__row { cursor: pointer; transition: background 0.15s ease; }
.ut__row:hover td { background: ${config.rowHoverBackground} !important; }
.ut__row--selected td { background: ${config.accentColor}18 !important; }
.ut__row--stripe td { background: ${config.rowStripeColor}; }

.ut__td {
  padding: ${pad};
  background: ${config.rowBackground};
  color: ${config.rowTextColor};
  border-bottom: 1px solid ${config.rowDividerColor};
  vertical-align: middle;
  transition: background 0.15s ease;
}
.ut__td--muted { color: ${config.rowSubtextColor}; }
.ut__td--check { width: 44px; }
.ut__td--chevron { width: 40px; text-align: center; }

/* ── Checkbox ──────────────────────────────────── */
.ut__checkbox { accent-color: ${config.checkboxColor}; width: 14px; height: 14px; cursor: pointer; }

/* ── User Cell ─────────────────────────────────── */
.ut__user-cell { display: flex; align-items: center; gap: 10px; }
.ut__avatar {
  width: ${config.avatarSize}px; height: ${config.avatarSize}px;
  border-radius: ${config.avatarBorderRadius}px;
  background: ${config.avatarBackground};
  color: ${config.avatarTextColor};
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: ${config.fontSize - 1}px;
  flex-shrink: 0; letter-spacing: 0.03em;
  border: 1px solid ${config.borderColor};
}
.ut__name { color: ${config.rowTextColor}; font-weight: 600; font-size: ${config.fontSize}px; line-height: 1.3; }
.ut__joined { color: ${config.rowSubtextColor}; font-size: ${config.fontSize - 2}px; margin-top: 1px; }

/* ── Role Badges ───────────────────────────────── */
.ut__badge {
  padding: 3px 8px; font-size: 11px; font-weight: 700;
  letter-spacing: 0.05em; text-transform: uppercase;
  display: inline-block; border-radius: ${config.badgeBorderRadius}px;
}
.ut__badge--administrator { background: ${config.adminBadgeBackground}; color: ${config.adminBadgeTextColor}; }
.ut__badge--editor        { background: ${config.editorBadgeBackground}; color: ${config.editorBadgeTextColor}; }
.ut__badge--viewer        { background: ${config.viewerBadgeBackground}; color: ${config.viewerBadgeTextColor}; }

/* ── Status Pills ──────────────────────────────── */
.ut__status {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 3px 8px; border-radius: 20px;
  font-size: 11px; font-weight: 600;
}
.ut__status-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
.ut__status--active   { background: ${config.activeBackground};   color: ${config.activeTextColor}; }
.ut__status--active   .ut__status-dot { background: ${config.activeDotColor}; }
.ut__status--inactive { background: ${config.inactiveBackground}; color: ${config.inactiveTextColor}; }
.ut__status--inactive .ut__status-dot { background: ${config.inactiveDotColor}; }
.ut__status--pending  { background: ${config.pendingBackground};  color: ${config.pendingTextColor}; }
.ut__status--pending  .ut__status-dot { background: ${config.pendingDotColor}; }

/* ── Chevron ───────────────────────────────────── */
.ut__chevron {
  display: inline-block; color: ${config.chevronColor};
  font-size: 16px; line-height: 1;
  transition: transform 0.2s ease;
}
.ut__chevron--open { transform: rotate(90deg); }

/* ── Expanded Row ──────────────────────────────── */
.ut__expanded-row { cursor: default; }
.ut__expanded-td {
  padding: 0 !important;
  background: ${config.expandedBackground} !important;
  border-bottom: 1px solid ${config.rowDividerColor};
}
.ut__expanded-inner {
  border-left: 3px solid ${config.expandedAccentBorder};
  margin-left: 44px;
  padding: 16px 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}
.ut__expanded-label {
  color: ${config.headerTextColor}; font-size: 11px; font-weight: 700;
  letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 10px;
}
.ut__expanded-text { color: ${config.expandedTextColor}; font-size: ${config.fontSize}px; }
.ut__expanded-text--empty { font-style: italic; }
.ut__permissions { display: flex; flex-wrap: wrap; gap: 6px; }
.ut__permission-tag {
  background: ${config.backgroundColor};
  border: 1px solid ${config.borderColor};
  border-radius: 4px; padding: 3px 8px;
  color: ${config.expandedTextColor}; font-size: ${config.fontSize - 1}px;
}
.ut__activity { list-style: none; padding: 0; margin: 0; }
.ut__activity-item { display: flex; gap: 12px; margin-bottom: 8px; font-size: ${config.fontSize}px; }
.ut__activity-time { color: ${config.rowSubtextColor}; min-width: 70px; flex-shrink: 0; }
.ut__activity-action { color: ${config.expandedTextColor}; }

/* ── Pagination ────────────────────────────────── */
.ut__pagination {
  padding: 10px 16px;
  border-top: 1px solid ${config.paginationBorderColor};
  background: ${config.paginationBackground};
  display: flex; align-items: center; justify-content: space-between;
}
.ut__pagination-info { color: ${config.paginationTextColor}; font-size: ${config.fontSize}px; }
.ut__pagination-info strong { color: ${config.rowTextColor}; }
.ut__pagination-pages { display: flex; gap: 4px; }
.ut__page-btn {
  width: 30px; height: 30px;
  display: flex; align-items: center; justify-content: center;
  border-radius: 6px;
  border: 1px solid ${config.paginationBorderColor};
  background: ${config.paginationBackground};
  color: ${config.paginationTextColor};
  cursor: pointer; font-size: ${config.fontSize}px;
  font-family: inherit; transition: background 0.15s ease;
}
.ut__page-btn:hover { background: ${config.rowHoverBackground}; color: ${config.rowTextColor}; }
.ut__page-btn--active {
  background: ${config.paginationActiveBackground};
  color: ${config.paginationActiveTextColor};
  border-color: ${config.paginationActiveBackground};
  font-weight: 700;
}

/* ── Summary Cards ─────────────────────────────── */
.ut__cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px; margin-top: 16px;
}
.ut__card {
  background: ${config.summaryCardBackground};
  border: 1px solid ${config.summaryCardBorderColor};
  border-radius: ${config.borderRadius}px;
  padding: 14px 16px;
}
.ut__card-header { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
.ut__card-icon { color: ${config.summaryCardIconColor}; font-size: 16px; line-height: 1; }
.ut__card-title { color: ${config.rowTextColor}; font-weight: 600; font-size: ${config.fontSize + 1}px; }
.ut__card-desc { color: ${config.rowSubtextColor}; font-size: ${config.fontSize - 1}px; margin: 0; line-height: 1.5; }

/* ── Row Animation ─────────────────────────────── */
.ut__row { transition: opacity 0.25s ease, transform 0.25s ease, background 0.15s ease; }

@media (max-width: 640px) {
  .ut__cards { grid-template-columns: 1fr; }
  .ut__expanded-inner { grid-template-columns: 1fr; }
}
`;
}
