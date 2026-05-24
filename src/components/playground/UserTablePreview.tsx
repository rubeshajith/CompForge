"use client";

// /components/playground/UserTablePreview.tsx

import { useState, useEffect } from "react";
import { UserTableConfig } from "@/lib/userTableConfig";

interface UserTablePreviewProps {
  config: UserTableConfig;
}

type UserStatus = "Active" | "Inactive" | "Pending";
type UserRole = "Administrator" | "Editor" | "Viewer";

interface User {
  id: string;
  initials: string;
  name: string;
  email: string;
  role: UserRole;
  joined: string;
  lastLogin: string;
  status: UserStatus;
  permissions: string[];
  activity: { time: string; action: string }[];
  workspaces?: string;
}

const USERS: User[] = [
  {
    id: "u1",
    initials: "JD",
    name: "Jordan Davis",
    email: "jordan.davis@dataengine.pro",
    role: "Administrator",
    joined: "12 Mar 2023",
    lastLogin: "2 mins ago",
    status: "Active",
    permissions: [
      "Data Write",
      "API Management",
      "Billing View",
      "User Invite",
    ],
    activity: [
      {
        time: "10:45 AM",
        action: "Changed system retention policy to 90 days",
      },
      { time: "09:12 AM", action: "Logged in from 192.168.1.1" },
      {
        time: "Yesterday",
        action: "Generated quarterly infrastructure cost report",
      },
    ],
    workspaces: "Global Workspace, Internal Sandbox, Production DB Mirror",
  },
  {
    id: "u2",
    initials: "MR",
    name: "Morgan Reed",
    email: "m.reed@partner.net",
    role: "Editor",
    joined: "28 Jan 2024",
    lastLogin: "Yesterday",
    status: "Active",
    permissions: ["Data Write", "API Read"],
    activity: [{ time: "Yesterday", action: "Updated 3 dataset schemas" }],
  },
  {
    id: "u3",
    initials: "SK",
    name: "Sam Kim",
    email: "sam.kim@external.io",
    role: "Viewer",
    joined: "15 Oct 2022",
    lastLogin: "14 May 2024",
    status: "Inactive",
    permissions: ["Data Read"],
    activity: [],
  },
  {
    id: "u4",
    initials: "LW",
    name: "Lee Wong",
    email: "lee.w@dataengine.pro",
    role: "Administrator",
    joined: "03 Aug 2023",
    lastLogin: "Just now",
    status: "Active",
    permissions: [
      "Data Write",
      "API Management",
      "User Invite",
      "Billing Write",
    ],
    activity: [
      { time: "Just now", action: "Logged in from 10.0.0.42 (Singapore)" },
      {
        time: "11:00 AM",
        action: "Provisioned new API key for analytics service",
      },
    ],
    workspaces: "Global Workspace, Production DB Mirror",
  },
  {
    id: "u5",
    initials: "AP",
    name: "Alex Park",
    email: "a.park@dataengine.pro",
    role: "Editor",
    joined: "19 Jun 2024",
    lastLogin: "3 hours ago",
    status: "Pending",
    permissions: ["Data Write"],
    activity: [
      {
        time: "Pending",
        action: "Awaiting MFA setup before full access granted",
      },
    ],
  },
];

function getDensityPadding(density: UserTableConfig["density"]) {
  return density === "compact"
    ? "6px 12px"
    : density === "spacious"
      ? "16px 20px"
      : "10px 16px";
}

export function UserTablePreview({ config }: UserTablePreviewProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleRows, setVisibleRows] = useState<Set<string>>(new Set());

  const pad = getDensityPadding(config.density);

  // Animate rows in on mount or config change
  useEffect(() => {
    if (!config.animateRows) {
      setVisibleRows(new Set(USERS.map((u) => u.id)));
      return;
    }
    setVisibleRows(new Set());
    const timers = USERS.map((u, i) =>
      setTimeout(
        () => setVisibleRows((prev) => new Set([...prev, u.id])),
        i * 60,
      ),
    );
    return () => timers.forEach(clearTimeout);
  }, [config.animateRows]);

  const filteredUsers = USERS.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.role.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  function toggleRow(id: string) {
    if (!config.showExpandableRows) return;
    setExpandedRows((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleSelect(id: string) {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function handleSelectAll(checked: boolean) {
    setSelectAll(checked);
    setSelectedRows(
      checked ? new Set(filteredUsers.map((u) => u.id)) : new Set(),
    );
  }

  function getRoleBadgeStyle(role: UserRole): React.CSSProperties {
    if (role === "Administrator")
      return {
        background: config.adminBadgeBackground,
        color: config.adminBadgeTextColor,
        borderRadius: config.badgeBorderRadius,
      };
    if (role === "Editor")
      return {
        background: config.editorBadgeBackground,
        color: config.editorBadgeTextColor,
        borderRadius: config.badgeBorderRadius,
      };
    return {
      background: config.viewerBadgeBackground,
      color: config.viewerBadgeTextColor,
      borderRadius: config.badgeBorderRadius,
    };
  }

  function getStatusStyle(status: UserStatus): React.CSSProperties {
    if (status === "Active")
      return {
        background: config.activeBackground,
        color: config.activeTextColor,
      };
    if (status === "Inactive")
      return {
        background: config.inactiveBackground,
        color: config.inactiveTextColor,
      };
    return {
      background: config.pendingBackground,
      color: config.pendingTextColor,
    };
  }

  function getStatusDotColor(status: UserStatus): string {
    if (status === "Active") return config.activeDotColor;
    if (status === "Inactive") return config.inactiveDotColor;
    return config.pendingDotColor;
  }

  const containerStyle: React.CSSProperties = {
    width: config.tableWidth,
    maxWidth: "100%",
    fontFamily: "'Instrument Sans', sans-serif",
    fontSize: config.fontSize,
  };

  const tableWrapStyle: React.CSSProperties = {
    background: config.backgroundColor,
    border: `1px solid ${config.borderColor}`,
    borderRadius: config.borderRadius,
    overflow: "hidden",
    boxShadow: config.showShadow ? "0 4px 24px rgba(0,0,0,0.5)" : "none",
  };

  const thStyle: React.CSSProperties = {
    padding: pad,
    background: config.headerBackground,
    color: config.headerTextColor,
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    borderBottom: `1px solid ${config.headerBorderColor}`,
    whiteSpace: "nowrap",
  };

  const tdStyle = (rowBg: string): React.CSSProperties => ({
    padding: pad,
    background: rowBg,
    color: config.rowTextColor,
    borderBottom: `1px solid ${config.rowDividerColor}`,
    verticalAlign: "middle",
    transition: config.animateRows ? "background 0.15s ease" : "none",
  });

  return (
    <div style={containerStyle}>
      {/* Bulk Actions Bar */}
      {config.showBulkActions && selectedRows.size > 0 && (
        <div
          style={{
            background: config.bulkBarBackground,
            color: config.bulkBarTextColor,
            border: `1px solid ${config.borderColor}`,
            borderRadius: `${config.borderRadius}px ${config.borderRadius}px 0 0`,
            padding: "8px 16px",
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: -1,
            fontSize: config.fontSize,
          }}
        >
          <span style={{ fontWeight: 700 }}>
            {selectedRows.size} user{selectedRows.size > 1 ? "s" : ""} selected
          </span>
          <div
            style={{ width: 1, height: 16, background: config.borderColor }}
          />
          <button
            style={{
              background: "none",
              border: "none",
              color: config.bulkBarTextColor,
              cursor: "pointer",
              fontSize: config.fontSize,
              display: "flex",
              alignItems: "center",
              gap: 4,
              opacity: 0.9,
            }}
          >
            ✎ Change Role
          </button>
          <button
            style={{
              background: "none",
              border: "none",
              color: "#f87171",
              cursor: "pointer",
              fontSize: config.fontSize,
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            ✕ Delete
          </button>
          <div style={{ marginLeft: "auto" }}>
            <button
              onClick={() => {
                setSelectedRows(new Set());
                setSelectAll(false);
              }}
              style={{
                background: "none",
                border: "none",
                color: config.bulkBarTextColor,
                cursor: "pointer",
                fontSize: 16,
                lineHeight: 1,
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div style={tableWrapStyle}>
        {/* Toolbar */}
        {config.showSearch && (
          <div
            style={{
              padding: "12px 16px",
              borderBottom: `1px solid ${config.headerBorderColor}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              background: config.headerBackground,
            }}
          >
            <div style={{ position: "relative", flexShrink: 0 }}>
              <span
                style={{
                  position: "absolute",
                  left: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: config.headerTextColor,
                  fontSize: 14,
                  pointerEvents: "none",
                }}
              >
                ⌕
              </span>
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search users…"
                style={{
                  background: config.backgroundColor,
                  border: `1px solid ${config.borderColor}`,
                  borderRadius: 6,
                  padding: "6px 10px 6px 28px",
                  color: config.rowTextColor,
                  fontSize: config.fontSize,
                  outline: "none",
                  width: 200,
                }}
              />
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                style={{
                  background: config.backgroundColor,
                  border: `1px solid ${config.borderColor}`,
                  color: config.rowSubtextColor,
                  borderRadius: 6,
                  padding: "6px 12px",
                  cursor: "pointer",
                  fontSize: config.fontSize,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                ↓ Export
              </button>
              <button
                style={{
                  background: config.accentColor,
                  border: "none",
                  color: "#ffffff",
                  borderRadius: 6,
                  padding: "6px 14px",
                  cursor: "pointer",
                  fontSize: config.fontSize,
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                + Add User
              </button>
            </div>
          </div>
        )}

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {config.showBulkActions && (
                  <th style={{ ...thStyle, width: 44 }}>
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      style={{
                        accentColor: config.checkboxColor,
                        width: 14,
                        height: 14,
                      }}
                    />
                  </th>
                )}
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Role</th>
                <th style={thStyle}>Last Login</th>
                <th style={thStyle}>Status</th>
                {config.showExpandableRows && (
                  <th style={{ ...thStyle, width: 40 }} />
                )}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, i) => {
                const isExpanded = expandedRows.has(user.id);
                const isSelected = selectedRows.has(user.id);
                const isVisible = visibleRows.has(user.id);
                const isStripe = config.stripedRows && i % 2 === 1;
                const rowBg = isSelected
                  ? `${config.accentColor}18`
                  : isStripe
                    ? config.rowStripeColor
                    : config.rowBackground;

                return [
                  <tr
                    key={user.id}
                    onClick={() => toggleRow(user.id)}
                    style={{
                      cursor: config.showExpandableRows ? "pointer" : "default",
                      opacity: config.animateRows ? (isVisible ? 1 : 0) : 1,
                      transform: config.animateRows
                        ? isVisible
                          ? "translateY(0)"
                          : "translateY(8px)"
                        : "none",
                      transition: config.animateRows
                        ? "opacity 0.25s ease, transform 0.25s ease"
                        : "none",
                    }}
                    onMouseEnter={(e) => {
                      (
                        e.currentTarget as HTMLTableRowElement
                      ).style.background = config.rowHoverBackground;
                    }}
                    onMouseLeave={(e) => {
                      (
                        e.currentTarget as HTMLTableRowElement
                      ).style.background = rowBg;
                    }}
                  >
                    {config.showBulkActions && (
                      <td
                        style={{ ...tdStyle(rowBg), width: 44 }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(user.id)}
                          style={{
                            accentColor: config.checkboxColor,
                            width: 14,
                            height: 14,
                          }}
                        />
                      </td>
                    )}
                    {/* Name */}
                    <td style={tdStyle(rowBg)}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <div
                          style={{
                            width: config.avatarSize,
                            height: config.avatarSize,
                            borderRadius: config.avatarBorderRadius,
                            background: config.avatarBackground,
                            color: config.avatarTextColor,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 700,
                            fontSize: config.fontSize - 1,
                            flexShrink: 0,
                            letterSpacing: "0.03em",
                            border: `1px solid ${config.borderColor}`,
                          }}
                        >
                          {user.initials}
                        </div>
                        <div>
                          <div
                            style={{
                              color: config.rowTextColor,
                              fontWeight: 600,
                              fontSize: config.fontSize,
                              lineHeight: 1.3,
                            }}
                          >
                            {user.name}
                          </div>
                          <div
                            style={{
                              color: config.rowSubtextColor,
                              fontSize: config.fontSize - 2,
                              marginTop: 1,
                            }}
                          >
                            Joined {user.joined}
                          </div>
                        </div>
                      </div>
                    </td>
                    {/* Email */}
                    <td
                      style={{
                        ...tdStyle(rowBg),
                        color: config.rowSubtextColor,
                        fontSize: config.fontSize,
                      }}
                    >
                      {user.email}
                    </td>
                    {/* Role Badge */}
                    <td style={tdStyle(rowBg)}>
                      <span
                        style={{
                          ...getRoleBadgeStyle(user.role),
                          padding: "3px 8px",
                          fontSize: 11,
                          fontWeight: 700,
                          letterSpacing: "0.05em",
                          textTransform: "uppercase",
                          display: "inline-block",
                        }}
                      >
                        {user.role}
                      </span>
                    </td>
                    {/* Last Login */}
                    <td
                      style={{
                        ...tdStyle(rowBg),
                        color: config.rowSubtextColor,
                        fontSize: config.fontSize,
                      }}
                    >
                      {user.lastLogin}
                    </td>
                    {/* Status */}
                    <td style={tdStyle(rowBg)}>
                      <span
                        style={{
                          ...getStatusStyle(user.status),
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 5,
                          padding: "3px 8px",
                          borderRadius: 20,
                          fontSize: 11,
                          fontWeight: 600,
                        }}
                      >
                        <span
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: getStatusDotColor(user.status),
                            flexShrink: 0,
                          }}
                        />
                        {user.status}
                      </span>
                    </td>
                    {/* Chevron */}
                    {config.showExpandableRows && (
                      <td
                        style={{
                          ...tdStyle(rowBg),
                          width: 40,
                          textAlign: "center",
                        }}
                      >
                        <span
                          style={{
                            display: "inline-block",
                            color: config.chevronColor,
                            fontSize: 14,
                            transform: isExpanded
                              ? "rotate(90deg)"
                              : "rotate(0deg)",
                            transition: "transform 0.2s ease",
                            lineHeight: 1,
                          }}
                        >
                          ›
                        </span>
                      </td>
                    )}
                  </tr>,

                  /* Expanded Row */
                  config.showExpandableRows && isExpanded ? (
                    <tr key={`${user.id}-expanded`}>
                      <td
                        colSpan={
                          (config.showBulkActions ? 1 : 0) +
                          5 +
                          (config.showExpandableRows ? 1 : 0)
                        }
                        style={{
                          padding: 0,
                          background: config.expandedBackground,
                          borderBottom: `1px solid ${config.rowDividerColor}`,
                        }}
                      >
                        <div
                          style={{
                            borderLeft: `3px solid ${config.expandedAccentBorder}`,
                            marginLeft: config.showBulkActions ? 44 : 0,
                            padding: "16px 20px",
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: 24,
                          }}
                        >
                          {/* Permissions */}
                          <div>
                            <div
                              style={{
                                color: config.headerTextColor,
                                fontSize: 11,
                                fontWeight: 700,
                                letterSpacing: "0.06em",
                                textTransform: "uppercase",
                                marginBottom: 10,
                              }}
                            >
                              Permissions &amp; Access
                            </div>
                            <div
                              style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 6,
                              }}
                            >
                              {user.permissions.map((p) => (
                                <span
                                  key={p}
                                  style={{
                                    background: config.backgroundColor,
                                    border: `1px solid ${config.borderColor}`,
                                    borderRadius: 4,
                                    padding: "3px 8px",
                                    color: config.expandedTextColor,
                                    fontSize: config.fontSize - 1,
                                  }}
                                >
                                  {p}
                                </span>
                              ))}
                            </div>
                            {user.workspaces && (
                              <div style={{ marginTop: 12 }}>
                                <div
                                  style={{
                                    color: config.headerTextColor,
                                    fontSize: 11,
                                    fontWeight: 700,
                                    letterSpacing: "0.06em",
                                    textTransform: "uppercase",
                                    marginBottom: 6,
                                  }}
                                >
                                  Workspaces
                                </div>
                                <div
                                  style={{
                                    color: config.expandedTextColor,
                                    fontSize: config.fontSize,
                                  }}
                                >
                                  {user.workspaces}
                                </div>
                              </div>
                            )}
                          </div>
                          {/* Activity */}
                          <div>
                            <div
                              style={{
                                color: config.headerTextColor,
                                fontSize: 11,
                                fontWeight: 700,
                                letterSpacing: "0.06em",
                                textTransform: "uppercase",
                                marginBottom: 10,
                              }}
                            >
                              Recent Activity
                            </div>
                            {user.activity.length === 0 ? (
                              <div
                                style={{
                                  color: config.expandedTextColor,
                                  fontStyle: "italic",
                                  fontSize: config.fontSize,
                                }}
                              >
                                No recent activity recorded.
                              </div>
                            ) : (
                              <ul
                                style={{
                                  listStyle: "none",
                                  padding: 0,
                                  margin: 0,
                                }}
                              >
                                {user.activity.map((a, ai) => (
                                  <li
                                    key={ai}
                                    style={{
                                      display: "flex",
                                      gap: 12,
                                      marginBottom: 8,
                                      fontSize: config.fontSize,
                                    }}
                                  >
                                    <span
                                      style={{
                                        color: config.rowSubtextColor,
                                        minWidth: 70,
                                        flexShrink: 0,
                                      }}
                                    >
                                      {a.time}
                                    </span>
                                    <span
                                      style={{
                                        color: config.expandedTextColor,
                                      }}
                                    >
                                      {a.action}
                                    </span>
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

        {/* Pagination */}
        <div
          style={{
            padding: "10px 16px",
            borderTop: `1px solid ${config.paginationBorderColor}`,
            background: config.paginationBackground,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              color: config.paginationTextColor,
              fontSize: config.fontSize,
            }}
          >
            Showing <strong style={{ color: config.rowTextColor }}>1–5</strong>{" "}
            of <strong style={{ color: config.rowTextColor }}>156</strong> users
          </span>
          <div style={{ display: "flex", gap: 4 }}>
            {["‹", "1", "2", "3", "›"].map((p) => (
              <button
                key={p}
                style={{
                  width: 30,
                  height: 30,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 6,
                  border: `1px solid ${p === "1" ? config.paginationActiveBackground : config.paginationBorderColor}`,
                  background:
                    p === "1"
                      ? config.paginationActiveBackground
                      : config.paginationBackground,
                  color:
                    p === "1"
                      ? config.paginationActiveTextColor
                      : config.paginationTextColor,
                  cursor: "pointer",
                  fontSize: config.fontSize,
                  fontWeight: p === "1" ? 700 : 400,
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      {config.showSummaryCards && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 12,
            marginTop: 16,
          }}
        >
          {[
            {
              icon: "🔒",
              title: "Security Posture",
              desc: "88% of users have MFA enabled. 12 pending invites expired.",
            },
            {
              icon: "⬡",
              title: "License Utilization",
              desc: "156 of 200 seats used. 44 more seats available on Enterprise Tier.",
            },
            {
              icon: "⧖",
              title: "Session Audits",
              desc: "No suspicious login attempts detected in the last 72 hours.",
            },
          ].map((card) => (
            <div
              key={card.title}
              style={{
                background: config.summaryCardBackground,
                border: `1px solid ${config.summaryCardBorderColor}`,
                borderRadius: config.borderRadius,
                padding: "14px 16px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 6,
                }}
              >
                <span
                  style={{
                    color: config.summaryCardIconColor,
                    fontSize: 16,
                    lineHeight: 1,
                  }}
                >
                  {card.icon}
                </span>
                <span
                  style={{
                    color: config.rowTextColor,
                    fontWeight: 600,
                    fontSize: config.fontSize + 1,
                  }}
                >
                  {card.title}
                </span>
              </div>
              <p
                style={{
                  color: config.rowSubtextColor,
                  fontSize: config.fontSize - 1,
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
