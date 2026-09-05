/* @ds-bundle: {"format":4,"namespace":"GrowlandDesignSystem_5ed90c","components":[{"name":"ClubCard","sourcePath":"components/cards/ClubCard.jsx"},{"name":"ListItem","sourcePath":"components/cards/ListItem.jsx"},{"name":"MenuCard","sourcePath":"components/cards/MenuCard.jsx"},{"name":"Avatar","sourcePath":"components/core/Avatar.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Checkbox","sourcePath":"components/core/Checkbox.jsx"},{"name":"Icon","sourcePath":"components/core/Icon.jsx"},{"name":"Input","sourcePath":"components/core/Input.jsx"},{"name":"OtpInput","sourcePath":"components/core/OtpInput.jsx"},{"name":"ProgressBar","sourcePath":"components/core/ProgressBar.jsx"},{"name":"TabBar","sourcePath":"components/navigation/TabBar.jsx"},{"name":"TopBar","sourcePath":"components/navigation/TopBar.jsx"}],"sourceHashes":{"components/cards/ClubCard.jsx":"56a7837962c7","components/cards/ListItem.jsx":"f951802bc857","components/cards/MenuCard.jsx":"df51711e1f97","components/core/Avatar.jsx":"4b931b7eecdc","components/core/Badge.jsx":"ac1b834f197e","components/core/Button.jsx":"ba27b3a7a831","components/core/Checkbox.jsx":"51c46a0ca143","components/core/Icon.jsx":"a432e2e45469","components/core/Input.jsx":"cee254e9759c","components/core/OtpInput.jsx":"f1728ab5814e","components/core/ProgressBar.jsx":"944536f16543","components/navigation/TabBar.jsx":"e344014cc54a","components/navigation/TopBar.jsx":"55e87d0667bf","ui_kits/growland-app/App.jsx":"a8b7c57b1e06","ui_kits/growland-app/Auth.jsx":"308e7300b29f","ui_kits/growland-app/Calendar.jsx":"14875453eaec","ui_kits/growland-app/Chats.jsx":"aed4904717ed","ui_kits/growland-app/Clubs.jsx":"fcf2cb5fb2ee","ui_kits/growland-app/Dictionary.jsx":"c1537dc9fb92","ui_kits/growland-app/Home.jsx":"08bdc791d08a","ui_kits/growland-app/Onboarding.jsx":"07f9aece5f17","ui_kits/growland-app/ios-frame.jsx":"24642b887be3"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.GrowlandDesignSystem_5ed90c = window.GrowlandDesignSystem_5ed90c || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Avatar.jsx
try { (() => {
function Avatar({
  src,
  name = '',
  size = 40,
  style
}) {
  const initials = name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  return React.createElement('div', {
    style: {
      width: size,
      height: size,
      borderRadius: '50%',
      overflow: 'hidden',
      flexShrink: 0,
      background: 'var(--mint-300)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-base)',
      fontWeight: 600,
      color: 'var(--green-900)',
      fontSize: size * 0.4,
      ...style
    }
  }, src ? React.createElement('img', {
    src,
    alt: name,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }) : initials);
}
Object.assign(__ds_scope, { Avatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Avatar.jsx", error: String((e && e.message) || e) }); }

// components/cards/ListItem.jsx
try { (() => {
function ListItem({
  avatarSrc,
  title,
  subtitle,
  meta,
  unread,
  onClick,
  style
}) {
  return React.createElement('div', {
    onClick,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '12px 4px',
      cursor: 'pointer',
      fontFamily: 'var(--font-base)',
      ...style
    }
  }, React.createElement(__ds_scope.Avatar, {
    src: avatarSrc,
    name: title,
    size: 42
  }), React.createElement('div', {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, React.createElement('div', {
    style: {
      fontSize: 14,
      fontWeight: 600,
      color: 'var(--text-primary)'
    }
  }, title), React.createElement('div', {
    style: {
      fontSize: 12,
      color: 'var(--text-secondary)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, subtitle)), React.createElement('div', {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: 4
    }
  }, meta && React.createElement('span', {
    style: {
      fontSize: 11,
      color: 'var(--text-tertiary)'
    }
  }, meta), unread && React.createElement('span', {
    style: {
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: 'var(--green-500)'
    }
  })));
}
Object.assign(__ds_scope, { ListItem });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/ListItem.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
const tones = {
  pro: {
    bg: 'var(--green-900)',
    color: '#fff'
  },
  free: {
    bg: 'var(--mint-200)',
    color: 'var(--green-900)'
  },
  neutral: {
    bg: 'var(--neutral-200)',
    color: 'var(--text-primary)'
  }
};
function Badge({
  children,
  tone = 'neutral',
  style
}) {
  const t = tones[tone] || tones.neutral;
  return React.createElement('span', {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      fontFamily: 'var(--font-base)',
      fontWeight: 600,
      fontSize: 11,
      padding: '4px 10px',
      borderRadius: 'var(--radius-pill)',
      background: t.bg,
      color: t.color,
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
const sizes = {
  md: {
    padding: '14px 24px',
    fontSize: 14
  },
  lg: {
    padding: '16px 28px',
    fontSize: 15
  }
};
function Button({
  variant = 'primary',
  size = 'lg',
  disabled = false,
  fullWidth = false,
  children,
  onClick,
  style,
  ...rest
}) {
  const base = {
    fontFamily: 'var(--font-base)',
    fontWeight: 600,
    border: 'none',
    borderRadius: 'var(--radius-pill)',
    cursor: disabled ? 'default' : 'pointer',
    width: fullWidth ? '100%' : 'auto',
    transition: 'background 150ms ease,transform 100ms ease',
    ...sizes[size]
  };
  const variants = {
    primary: {
      background: disabled ? 'var(--action-disabled-bg)' : 'var(--action-primary-bg)',
      color: disabled ? 'var(--action-disabled-text)' : 'var(--action-primary-text)'
    },
    secondary: {
      background: 'var(--action-secondary-bg)',
      color: 'var(--action-secondary-text)',
      border: '1px solid var(--action-secondary-border)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--action-secondary-text)',
      textDecoration: 'underline'
    }
  };
  return React.createElement('button', {
    disabled,
    onClick,
    style: {
      ...base,
      ...variants[variant],
      ...style
    },
    onMouseDown: e => {
      if (!disabled) e.currentTarget.style.transform = 'scale(0.98)';
    },
    onMouseUp: e => {
      e.currentTarget.style.transform = 'scale(1)';
    },
    ...rest
  }, children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/cards/ClubCard.jsx
try { (() => {
function ClubCard({
  title,
  level,
  spots,
  date,
  moderator,
  pro = false,
  joined = false,
  onJoin,
  style
}) {
  return React.createElement('div', {
    style: {
      background: 'var(--surface-card-chats)',
      borderRadius: 'var(--radius-lg)',
      padding: 18,
      fontFamily: 'var(--font-base)',
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      ...style
    }
  }, React.createElement('div', {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start'
    }
  }, React.createElement('div', {
    style: {
      fontSize: 15,
      fontWeight: 700,
      color: 'var(--green-900)'
    }
  }, title), React.createElement(__ds_scope.Badge, {
    tone: pro ? 'pro' : 'free'
  }, pro ? 'Pro' : 'Free')), React.createElement('div', {
    style: {
      fontSize: 12,
      color: 'var(--green-900)',
      opacity: 0.8,
      display: 'flex',
      gap: 12
    }
  }, React.createElement('span', null, level), React.createElement('span', null, spots + ' spots')), React.createElement('div', {
    style: {
      fontSize: 12,
      color: 'var(--green-900)',
      opacity: 0.8
    }
  }, date), React.createElement('div', {
    style: {
      fontSize: 12,
      color: 'var(--green-900)',
      opacity: 0.8
    }
  }, 'Moderator: ' + moderator), React.createElement(__ds_scope.Button, {
    variant: 'primary',
    fullWidth: true,
    size: 'md',
    onClick: onJoin
  }, joined ? 'Sign Up' : 'Join'));
}
Object.assign(__ds_scope, { ClubCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/ClubCard.jsx", error: String((e && e.message) || e) }); }

// components/core/Checkbox.jsx
try { (() => {
function Checkbox({
  checked,
  onChange,
  label,
  style
}) {
  return React.createElement('label', {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontFamily: 'var(--font-base)',
      fontSize: 13,
      color: 'var(--text-secondary)',
      cursor: 'pointer',
      ...style
    }
  }, React.createElement('span', {
    onClick: () => onChange && onChange(!checked),
    style: {
      width: 18,
      height: 18,
      borderRadius: 5,
      border: `1.5px solid ${checked ? 'var(--green-900)' : 'var(--border-default)'}`,
      background: checked ? 'var(--green-900)' : 'transparent',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, checked && React.createElement('svg', {
    width: 11,
    height: 11,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: '#fff',
    strokeWidth: 3,
    strokeLinecap: 'round',
    strokeLinejoin: 'round'
  }, React.createElement('path', {
    d: 'M20 6 9 17l-5-5'
  }))), label);
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/core/Icon.jsx
try { (() => {
const PATHS = {
  bell: 'M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9|M13.7 21a2 2 0 0 1-3.4 0',
  settings: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z|M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z',
  chevronLeft: 'M15 18l-6-6 6-6',
  chevronRight: 'M9 6l6 6-6 6',
  home: 'M3 9.5 12 3l9 6.5|M5 10v10h14V10',
  calendar: 'M3 5h18v16H3z|M8 3v4M16 3v4M3 10h18',
  book: 'M4 19V6a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H8l-4 4Z',
  chat: 'M4 19V6a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H8l-4 4Z',
  users: 'M2.5 20c.6-3.4 3-5.5 6.5-5.5s5.9 2.1 6.5 5.5|M16 14.3c2.6.3 4.4 2 4.9 4.7',
  mic: 'M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z|M19 11a7 7 0 0 1-14 0|M12 18v4',
  trophy: 'M8 4h8v4a4 4 0 0 1-8 0V4Z|M8 4H5a2 2 0 0 0 2 4h1V4Z|M16 4h3a2 2 0 0 1-2 4h-1V4Z|M9 18h6|M12 12v6',
  eye: 'M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z|M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  eyeOff: 'M17.9 17.9A10.9 10.9 0 0 1 12 19c-7 0-11-7-11-7a19.4 19.4 0 0 1 4.2-4.9M9.9 4.2A10.6 10.6 0 0 1 12 4c7 0 11 7 11 7a19.4 19.4 0 0 1-2.3 3.1|M14.1 14.1a3 3 0 1 1-4.2-4.2|M1 1l22 22',
  check: 'M20 6 9 17l-5-5',
  x: 'M18 6 6 18|M6 6l12 12',
  search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z|M21 21l-4.3-4.3',
  plus: 'M12 5v14M5 12h14',
  medal: 'M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z|M8.2 13.5 6 21l6-3 6 3-2.2-7.5'
};
function Icon({
  name,
  size = 20,
  color = 'currentColor',
  strokeWidth = 1.8,
  style,
  ...rest
}) {
  const d = PATHS[name];
  if (!d) return null;
  return React.createElement('svg', {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: color,
    strokeWidth,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    style,
    ...rest
  }, d.split('|').map((seg, i) => React.createElement(name === 'chat' ? 'path' : seg.match(/^M\d.*z$/i) && name === 'settings' ? 'path' : 'path', {
    key: i,
    d: seg
  })));
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Icon.jsx", error: String((e && e.message) || e) }); }

// components/cards/MenuCard.jsx
try { (() => {
const TINTS = {
  pink: 'var(--surface-card-clubs)',
  mint: 'var(--surface-card-chats)',
  amber: 'var(--surface-card-calendar)',
  teal: 'var(--surface-card-dictionary)'
};
function MenuCard({
  title,
  subtitle,
  icon,
  tint = 'mint',
  onClick,
  style
}) {
  return React.createElement('div', {
    onClick,
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '20px 22px',
      borderRadius: 'var(--radius-lg)',
      background: TINTS[tint] || TINTS.mint,
      cursor: 'pointer',
      fontFamily: 'var(--font-base)',
      ...style
    }
  }, React.createElement('div', null, React.createElement('div', {
    style: {
      fontSize: 16,
      fontWeight: 700,
      color: 'var(--green-900)'
    }
  }, title), React.createElement('div', {
    style: {
      fontSize: 12,
      color: 'var(--green-900)',
      opacity: 0.75
    }
  }, subtitle)), React.createElement('div', {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, icon && React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 24,
    color: 'var(--green-900)'
  }), React.createElement(__ds_scope.Icon, {
    name: 'chevronRight',
    size: 18,
    color: 'var(--green-900)'
  })));
}
Object.assign(__ds_scope, { MenuCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/MenuCard.jsx", error: String((e && e.message) || e) }); }

// components/core/Input.jsx
try { (() => {
const {
  useState
} = React;
function Input({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  helper,
  style
}) {
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';
  return React.createElement('div', {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      fontFamily: 'var(--font-base)',
      ...style
    }
  }, label && React.createElement('label', {
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: 'var(--text-primary)'
    }
  }, label), React.createElement('div', {
    style: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      borderBottom: `1px solid ${error ? 'var(--error)' : 'var(--border-default)'}`,
      paddingBottom: 8
    }
  }, React.createElement('input', {
    type: isPassword && show ? 'text' : type,
    placeholder,
    value,
    onChange,
    style: {
      border: 'none',
      outline: 'none',
      fontFamily: 'var(--font-base)',
      fontSize: 14,
      flex: 1,
      color: 'var(--text-primary)',
      background: 'transparent'
    }
  }), isPassword && React.createElement('span', {
    onClick: () => setShow(s => !s),
    style: {
      cursor: 'pointer',
      color: 'var(--text-secondary)',
      display: 'flex'
    }
  }, React.createElement(__ds_scope.Icon, {
    name: show ? 'eyeOff' : 'eye',
    size: 18
  }))), helper && React.createElement('span', {
    style: {
      fontSize: 12,
      color: error ? 'var(--error)' : 'var(--text-secondary)'
    }
  }, helper));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Input.jsx", error: String((e && e.message) || e) }); }

// components/core/OtpInput.jsx
try { (() => {
function OtpInput({
  length = 4,
  values,
  onChange,
  error
}) {
  const vals = values || Array(length).fill('');
  return React.createElement('div', {
    style: {
      display: 'flex',
      gap: 10,
      fontFamily: 'var(--font-base)'
    }
  }, vals.map((v, i) => React.createElement('input', {
    key: i,
    maxLength: 1,
    value: v,
    onChange: e => onChange && onChange(i, e.target.value.replace(/[^0-9]/g, '')),
    style: {
      width: 40,
      height: 44,
      textAlign: 'center',
      fontSize: 18,
      fontWeight: 600,
      color: 'var(--text-primary)',
      border: `1px solid ${error ? 'var(--error)' : 'var(--border-default)'}`,
      borderRadius: 'var(--radius-sm)',
      outline: 'none'
    }
  })));
}
Object.assign(__ds_scope, { OtpInput });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/OtpInput.jsx", error: String((e && e.message) || e) }); }

// components/core/ProgressBar.jsx
try { (() => {
function ProgressBar({
  value = 0,
  max = 100,
  style
}) {
  const pct = Math.min(100, Math.max(0, value / max * 100));
  return React.createElement('div', {
    style: {
      width: '100%',
      height: 8,
      borderRadius: 'var(--radius-pill)',
      background: 'var(--neutral-200)',
      overflow: 'hidden',
      ...style
    }
  }, React.createElement('div', {
    style: {
      width: pct + '%',
      height: '100%',
      background: 'var(--green-500)',
      borderRadius: 'var(--radius-pill)',
      transition: 'width 250ms ease'
    }
  }));
}
Object.assign(__ds_scope, { ProgressBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/ProgressBar.jsx", error: String((e && e.message) || e) }); }

// components/navigation/TabBar.jsx
try { (() => {
const items = [{
  key: 'home',
  label: 'Homepage',
  icon: 'home'
}, {
  key: 'calendar',
  label: 'Calendar',
  icon: 'calendar'
}, {
  key: 'words',
  label: 'Words',
  icon: 'book'
}, {
  key: 'clubs',
  label: 'Clubs',
  icon: 'mic'
}, {
  key: 'chats',
  label: 'Chats',
  icon: 'chat'
}];
function TabBar({
  active = 'home',
  onSelect,
  style
}) {
  return React.createElement('div', {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 12px',
      borderTop: '1px solid var(--border-default)',
      background: 'var(--bg-app)',
      fontFamily: 'var(--font-base)',
      ...style
    }
  }, items.map(it => {
    const isActive = it.key === active;
    return React.createElement('div', {
      key: it.key,
      onClick: () => onSelect && onSelect(it.key),
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 3,
        cursor: 'pointer',
        color: isActive ? 'var(--green-900)' : 'var(--text-tertiary)',
        flex: 1
      }
    }, React.createElement(__ds_scope.Icon, {
      name: it.icon,
      size: 20,
      color: isActive ? 'var(--green-900)' : 'var(--text-tertiary)'
    }), React.createElement('span', {
      style: {
        fontSize: 10,
        fontWeight: isActive ? 700 : 500
      }
    }, it.label));
  }));
}
Object.assign(__ds_scope, { TabBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/TabBar.jsx", error: String((e && e.message) || e) }); }

// components/navigation/TopBar.jsx
try { (() => {
function TopBar({
  name,
  subtitle,
  avatarSrc,
  onBack,
  title,
  style
}) {
  if (onBack) {
    return React.createElement('div', {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '14px 16px',
        fontFamily: 'var(--font-base)',
        ...style
      }
    }, React.createElement('span', {
      onClick: onBack,
      style: {
        cursor: 'pointer',
        display: 'flex'
      }
    }, React.createElement(__ds_scope.Icon, {
      name: 'chevronLeft',
      size: 20,
      color: 'var(--text-primary)'
    })), React.createElement('span', {
      style: {
        fontSize: 14,
        color: 'var(--text-secondary)'
      }
    }, title || 'Back'));
  }
  return React.createElement('div', {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '14px 16px',
      fontFamily: 'var(--font-base)',
      ...style
    }
  }, React.createElement('div', {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, React.createElement(__ds_scope.Avatar, {
    src: avatarSrc,
    name: name,
    size: 38
  }), React.createElement('div', null, React.createElement('div', {
    style: {
      fontSize: 14,
      fontWeight: 700,
      color: 'var(--text-primary)'
    }
  }, name), React.createElement('div', {
    style: {
      fontSize: 11,
      color: 'var(--text-secondary)'
    }
  }, subtitle))), React.createElement('div', {
    style: {
      display: 'flex',
      gap: 14,
      color: 'var(--text-primary)'
    }
  }, React.createElement(__ds_scope.Icon, {
    name: 'bell',
    size: 20
  }), React.createElement(__ds_scope.Icon, {
    name: 'settings',
    size: 20
  })));
}
Object.assign(__ds_scope, { TopBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/TopBar.jsx", error: String((e && e.message) || e) }); }

// ui_kits/growland-app/App.jsx
try { (() => {
const {
  TabBar
} = window.GrowlandDesignSystem_5ed90c;
function App() {
  const [stage, setStage] = React.useState('onboarding'); // onboarding | auth | app
  const [authMode, setAuthMode] = React.useState('login'); // login|signup|otp|newpw
  const [tab, setTab] = React.useState('home');
  if (stage === 'onboarding') return /*#__PURE__*/React.createElement(window.Onboarding, {
    onDone: mode => {
      setAuthMode(mode);
      setStage('auth');
    }
  });
  if (stage === 'auth') {
    if (authMode === 'login') return /*#__PURE__*/React.createElement(window.LoginForm, {
      onBack: () => setStage('onboarding'),
      onLogIn: () => setStage('app'),
      onGoSignup: () => setAuthMode('signup'),
      onForgot: () => setAuthMode('otp')
    });
    if (authMode === 'signup') return /*#__PURE__*/React.createElement(window.SignupForm, {
      onBack: () => setStage('onboarding'),
      onSignUp: () => setAuthMode('otp'),
      onGoLogin: () => setAuthMode('login')
    });
    if (authMode === 'otp') return /*#__PURE__*/React.createElement(window.OtpScreen, {
      onBack: () => setAuthMode('login'),
      onContinue: () => setAuthMode('newpw')
    });
    if (authMode === 'newpw') return /*#__PURE__*/React.createElement(window.NewPasswordScreen, {
      onBack: () => setAuthMode('otp'),
      onContinue: () => setStage('app')
    });
  }
  const screens = {
    home: /*#__PURE__*/React.createElement(window.Home, {
      onOpen: setTab
    }),
    clubs: /*#__PURE__*/React.createElement(window.Clubs, null),
    calendar: /*#__PURE__*/React.createElement(window.Calendar, null),
    chats: /*#__PURE__*/React.createElement(window.Chats, null),
    words: /*#__PURE__*/React.createElement(window.Dictionary, null)
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflow: 'hidden'
    }
  }, screens[tab]), /*#__PURE__*/React.createElement(TabBar, {
    active: tab,
    onSelect: setTab
  }));
}
window.App = App;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/growland-app/App.jsx", error: String((e && e.message) || e) }); }

// ui_kits/growland-app/Auth.jsx
try { (() => {
const {
  Button,
  Input,
  OtpInput,
  Checkbox,
  Icon
} = window.GrowlandDesignSystem_5ed90c;
function AuthShell({
  onBack,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      height: '100%',
      background: '#fff',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'var(--font-base)',
      boxSizing: 'border-box'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '20px 24px 0'
    }
  }, /*#__PURE__*/React.createElement("span", {
    onClick: onBack,
    style: {
      cursor: 'pointer',
      display: 'inline-flex',
      color: '#063417'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevronLeft",
    size: 20
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      padding: '12px 28px 32px'
    }
  }, children));
}
function LoginForm({
  onBack,
  onLogIn,
  onGoSignup,
  onForgot
}) {
  const [email, setEmail] = React.useState('');
  const [pw, setPw] = React.useState('');
  const [remember, setRemember] = React.useState(true);
  return /*#__PURE__*/React.createElement(AuthShell, {
    onBack: onBack
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 20,
      fontWeight: 700,
      color: '#063417',
      marginBottom: 24
    }
  }, "Welcome back"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 18,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "E-mail",
    placeholder: "Enter your E-mail",
    value: email,
    onChange: e => setEmail(e.target.value)
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Password",
    type: "password",
    placeholder: "Enter your password",
    value: pw,
    onChange: e => setPw(e.target.value)
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Checkbox, {
    checked: remember,
    onChange: setRemember,
    label: "Remember me"
  }), /*#__PURE__*/React.createElement("span", {
    onClick: onForgot,
    style: {
      fontSize: 12,
      color: '#063417',
      textDecoration: 'underline',
      cursor: 'pointer'
    }
  }, "Forgot password?"))), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    fullWidth: true,
    onClick: onLogIn
  }, "Log In"), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      fontSize: 12,
      color: '#6b6b6b',
      margin: '16px 0'
    }
  }, "Log in with"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      justifyContent: 'center',
      marginBottom: 16
    }
  }, ['G', 'f', 'A'].map(l => /*#__PURE__*/React.createElement("div", {
    key: l,
    style: {
      width: 44,
      height: 44,
      borderRadius: '50%',
      border: '1px solid #cfcfcf',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 700,
      color: '#063417'
    }
  }, l))), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      fontSize: 12,
      color: '#6b6b6b'
    }
  }, "Don't have an account? ", /*#__PURE__*/React.createElement("span", {
    onClick: onGoSignup,
    style: {
      color: '#063417',
      fontWeight: 700,
      cursor: 'pointer'
    }
  }, "Sign up")));
}
function SignupForm({
  onBack,
  onSignUp,
  onGoLogin
}) {
  return /*#__PURE__*/React.createElement(AuthShell, {
    onBack: onBack
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 20,
      fontWeight: 700,
      color: '#063417',
      marginBottom: 24
    }
  }, "Get Started"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 18,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Full Name",
    placeholder: "Enter your full name"
  }), /*#__PURE__*/React.createElement(Input, {
    label: "E-mail",
    placeholder: "Enter your E-mail"
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Password",
    type: "password",
    placeholder: "Enter your password"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: '#6b6b6b',
      marginBottom: 16
    }
  }, "By creating an account you agree to our terms of cooperation and privacy policy."), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    fullWidth: true,
    onClick: onSignUp
  }, "Sign Up"), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      fontSize: 12,
      color: '#6b6b6b',
      margin: '16px 0'
    }
  }, "Sign up with"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      justifyContent: 'center',
      marginBottom: 16
    }
  }, ['G', 'f', 'A'].map(l => /*#__PURE__*/React.createElement("div", {
    key: l,
    style: {
      width: 44,
      height: 44,
      borderRadius: '50%',
      border: '1px solid #cfcfcf',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 700,
      color: '#063417'
    }
  }, l))), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      fontSize: 12,
      color: '#6b6b6b'
    }
  }, "Already have an account? ", /*#__PURE__*/React.createElement("span", {
    onClick: onGoLogin,
    style: {
      color: '#063417',
      fontWeight: 700,
      cursor: 'pointer'
    }
  }, "Log in")));
}
function OtpScreen({
  onBack,
  onContinue,
  prompt
}) {
  const [vals, setVals] = React.useState(['', '', '', '']);
  const [error, setError] = React.useState(false);
  return /*#__PURE__*/React.createElement(AuthShell, {
    onBack: onBack
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 20,
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/mascot-verify.png",
    style: {
      width: 100
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      color: '#063417',
      fontWeight: 600,
      padding: '0 20px'
    }
  }, error ? 'Incorrect verification code. Check the code you entered and try again' : prompt || 'Enter the verification code that was sent to your email'), /*#__PURE__*/React.createElement(OtpInput, {
    values: vals,
    onChange: (i, v) => {
      const n = [...vals];
      n[i] = v;
      setVals(n);
    },
    error: error
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: '#6b6b6b'
    }
  }, "Send code again in ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#1a7a44'
    }
  }, "1:56s"))), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    fullWidth: true,
    onClick: () => {
      if (vals.join('').length === 4) {
        setError(false);
        onContinue();
      } else setError(true);
    }
  }, error ? 'Try again' : 'Continue'));
}
function NewPasswordScreen({
  onBack,
  onContinue
}) {
  const [pw, setPw] = React.useState('');
  const strength = pw.length === 0 ? null : pw.length < 8 ? 'weak' : 'strong';
  return /*#__PURE__*/React.createElement(AuthShell, {
    onBack: onBack
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      fontWeight: 600,
      color: '#063417',
      marginBottom: 20,
      textAlign: 'center'
    }
  }, "Choose a stronger password"), /*#__PURE__*/React.createElement(Input, {
    type: "password",
    placeholder: "Enter New Password",
    value: pw,
    onChange: e => setPw(e.target.value),
    helper: strength === 'weak' ? 'Weak password' : strength === 'strong' ? 'Strong password' : 'Use at least 8 characters. Do not use: simple or obvious passwords (123456, password, qwerty), personal data (name, date of birth).',
    error: strength === 'weak'
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    fullWidth: true,
    disabled: strength !== 'strong',
    onClick: onContinue
  }, "Change password"));
}
window.LoginForm = LoginForm;
window.SignupForm = SignupForm;
window.OtpScreen = OtpScreen;
window.NewPasswordScreen = NewPasswordScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/growland-app/Auth.jsx", error: String((e && e.message) || e) }); }

// ui_kits/growland-app/Calendar.jsx
try { (() => {
const {
  TopBar,
  Icon
} = window.GrowlandDesignSystem_5ed90c;
const DAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
function Calendar() {
  const weeks = [[30, 31, 1, 2, 3, 4, 5], [6, 7, 8, 9, 10, 11, 12], [13, 14, 15, 16, 17, 18, 19], [20, 21, 22, 23, 24, 25, 26], [27, 28, 29, 30, 31, 1, 2]];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      fontFamily: 'var(--font-base)',
      background: '#fff'
    }
  }, /*#__PURE__*/React.createElement(TopBar, {
    onBack: () => {},
    title: "Calendar"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: 'auto',
      padding: '0 20px 20px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevronLeft",
    size: 16
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: '#063417'
    }
  }, "January 2025"), /*#__PURE__*/React.createElement(Icon, {
    name: "chevronRight",
    size: 16
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7,1fr)',
      gap: 6,
      fontSize: 11,
      color: '#9a9a9a',
      textAlign: 'center',
      marginBottom: 6
    }
  }, DAYS.map(d => /*#__PURE__*/React.createElement("div", {
    key: d
  }, d))), weeks.map((w, wi) => /*#__PURE__*/React.createElement("div", {
    key: wi,
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7,1fr)',
      gap: 6,
      marginBottom: 6
    }
  }, w.map((d, di) => {
    const active = wi === 2 && di === 3;
    const inMonth = !(wi === 0 && di < 2) && !(wi === 4 && di > 1);
    return /*#__PURE__*/React.createElement("div", {
      key: di,
      style: {
        textAlign: 'center',
        padding: '8px 0',
        borderRadius: 8,
        fontSize: 12,
        background: active ? '#063417' : 'transparent',
        color: active ? '#fff' : inMonth ? '#063417' : '#cfcfcf'
      }
    }, d);
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16,
      fontSize: 12,
      fontWeight: 700,
      color: '#6b6b6b',
      marginBottom: 10
    }
  }, "This week's events"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      background: '#f6f6f6',
      borderRadius: 14,
      padding: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      minWidth: 44
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: '#6b6b6b'
    }
  }, "WED"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      fontWeight: 700,
      color: '#063417'
    }
  }, "15")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: '#063417'
    }
  }, "Moderator Ethan Reynolds"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: '#6b6b6b'
    }
  }, "Future of AI \xB7 10:00\u201311:30 AM")))));
}
window.Calendar = Calendar;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/growland-app/Calendar.jsx", error: String((e && e.message) || e) }); }

// ui_kits/growland-app/Chats.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  TopBar,
  ListItem,
  Icon,
  Input,
  Button
} = window.GrowlandDesignSystem_5ed90c;
const BUDDIES = [{
  title: 'Voxa',
  subtitle: "Hello! I'm Voxa, your AI conversation comp...",
  meta: '11:56',
  unread: true
}, {
  title: 'Elliot Brooks',
  subtitle: 'It was a great chat. Thanks!',
  meta: '09:20'
}, {
  title: 'Maya Jensen',
  subtitle: 'So u have some time this Tue? Ig I can...',
  meta: '21:42',
  unread: true
}, {
  title: 'Liam Foster',
  subtitle: "Hey! How's your day going so far?",
  meta: '20:03'
}, {
  title: 'Zoe Carter',
  subtitle: "Hi! What's something fun you've learn...",
  meta: '19:47'
}];
function ChatThread({
  buddy,
  onBack
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      fontFamily: 'var(--font-base)',
      background: '#fff'
    }
  }, /*#__PURE__*/React.createElement(TopBar, {
    onBack: onBack,
    title: buddy.title
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: 'auto',
      padding: '8px 16px',
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      alignSelf: 'flex-start',
      background: '#f6f6f6',
      borderRadius: 14,
      padding: '10px 14px',
      fontSize: 13,
      maxWidth: '75%'
    }
  }, "Hey! How was your weekend?"), /*#__PURE__*/React.createElement("div", {
    style: {
      alignSelf: 'flex-end',
      background: '#8adba6',
      borderRadius: 14,
      padding: '10px 14px',
      fontSize: 13,
      maxWidth: '75%'
    }
  }, "Pretty chill. Just caught up on some shows and went for a long walk. You?"), /*#__PURE__*/React.createElement("div", {
    style: {
      alignSelf: 'flex-start',
      background: '#f6f6f6',
      borderRadius: 14,
      padding: '10px 14px',
      fontSize: 13,
      maxWidth: '75%'
    }
  }, "Nice! Mine was good too \u2014 went hiking with some friends.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      padding: 12,
      borderTop: '1px solid #eee'
    }
  }, /*#__PURE__*/React.createElement(Input, {
    placeholder: "Type your message...",
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "md"
  }, "Send")));
}
function Chats() {
  const [tab, setTab] = React.useState('buddies');
  const [openBuddy, setOpenBuddy] = React.useState(null);
  if (openBuddy) return /*#__PURE__*/React.createElement(ChatThread, {
    buddy: openBuddy,
    onBack: () => setOpenBuddy(null)
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      fontFamily: 'var(--font-base)',
      background: '#fff'
    }
  }, /*#__PURE__*/React.createElement(TopBar, {
    onBack: () => {},
    title: "Chats"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 20,
      padding: '0 20px 10px',
      borderBottom: '1px solid #eee'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: () => setTab('buddies'),
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: tab === 'buddies' ? '#063417' : '#9a9a9a',
      paddingBottom: 8,
      borderBottom: tab === 'buddies' ? '2px solid #063417' : 'none',
      cursor: 'pointer'
    }
  }, "My buddies"), /*#__PURE__*/React.createElement("div", {
    onClick: () => setTab('clubs'),
    style: {
      fontSize: 13,
      fontWeight: 700,
      color: tab === 'clubs' ? '#063417' : '#9a9a9a',
      paddingBottom: 8,
      borderBottom: tab === 'clubs' ? '2px solid #063417' : 'none',
      cursor: 'pointer'
    }
  }, "My clubs")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: 'auto',
      padding: '8px 20px'
    }
  }, BUDDIES.map(b => /*#__PURE__*/React.createElement(ListItem, _extends({
    key: b.title
  }, b, {
    onClick: () => setOpenBuddy(b)
  })))));
}
window.Chats = Chats;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/growland-app/Chats.jsx", error: String((e && e.message) || e) }); }

// ui_kits/growland-app/Clubs.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  TopBar,
  ClubCard,
  Icon
} = window.GrowlandDesignSystem_5ed90c;
const GROUPS = [{
  title: 'Business English Discussion',
  level: 'Upper-Int',
  spots: '4/8',
  date: 'Jan 16, 2025 · 16:00',
  moderator: 'Anna Lee',
  pro: true
}, {
  title: 'Travel Stories Exchange',
  level: 'Intermediate',
  spots: '7/8',
  date: 'Jan 16, 2025 · 18:00',
  moderator: 'Anna Lee',
  pro: false
}, {
  title: 'Customs & Conversations',
  level: 'Upper-Int',
  spots: '2/8',
  date: 'Jan 20, 2025 · 17:00',
  moderator: 'Anna Lee',
  pro: true
}, {
  title: 'The Traditional Hangout',
  level: 'Beginner',
  spots: '5/8',
  date: 'Jan 20, 2025 · 19:00',
  moderator: 'Jason Miller',
  pro: false
}];
function Clubs() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      fontFamily: 'var(--font-base)',
      background: '#fff'
    }
  }, /*#__PURE__*/React.createElement(TopBar, {
    onBack: () => {},
    title: "Back"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: 'auto',
      padding: '0 20px 20px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      background: '#f6f6f6',
      borderRadius: 12,
      padding: '10px 14px',
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 16,
    color: "#6b6b6b"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: '#9a9a9a'
    }
  }, "Find a conversation group...")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      marginBottom: 16,
      fontSize: 12,
      color: '#063417'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      border: '1px solid #cfcfcf',
      borderRadius: 16,
      padding: '6px 12px'
    }
  }, "Date/Time"), /*#__PURE__*/React.createElement("span", {
    style: {
      border: '1px solid #cfcfcf',
      borderRadius: 16,
      padding: '6px 12px'
    }
  }, "Level"), /*#__PURE__*/React.createElement("span", {
    style: {
      border: '1px solid #cfcfcf',
      borderRadius: 16,
      padding: '6px 12px'
    }
  }, "Topic")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 700,
      color: '#6b6b6b',
      marginBottom: 10
    }
  }, "Nearest Groups"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, GROUPS.map(g => /*#__PURE__*/React.createElement(ClubCard, _extends({
    key: g.title
  }, g))))));
}
window.Clubs = Clubs;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/growland-app/Clubs.jsx", error: String((e && e.message) || e) }); }

// ui_kits/growland-app/Dictionary.jsx
try { (() => {
const {
  TopBar,
  Icon
} = window.GrowlandDesignSystem_5ed90c;
function Dictionary() {
  const [q, setQ] = React.useState('');
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      fontFamily: 'var(--font-base)',
      background: '#fff'
    }
  }, /*#__PURE__*/React.createElement(TopBar, {
    name: "Nina Thomas",
    subtitle: "Intermediate"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: 'auto',
      padding: '4px 20px 20px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      fontWeight: 700,
      color: '#063417',
      marginBottom: 12
    }
  }, "My Dictionary"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      background: '#f6f6f6',
      borderRadius: 12,
      padding: '10px 14px',
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 16,
    color: "#6b6b6b"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: '#9a9a9a'
    }
  }, "Search for a word...")), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-card-dictionary-tint)',
      borderRadius: 18,
      padding: 18,
      marginBottom: 12,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 700,
      color: '#063417'
    }
  }, "My saved words"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: '#063417',
      opacity: .75
    }
  }, "Hold your words here")), /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 20,
    color: "#063417"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-card-calendar-tint)',
      borderRadius: 18,
      padding: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      fontWeight: 700,
      color: '#063417'
    }
  }, "Daily Recommendation"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: '#063417',
      opacity: .75
    }
  }, "10 words")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 20,
      fontSize: 12,
      fontWeight: 700,
      color: '#6b6b6b',
      marginBottom: 10
    }
  }, "Abduct"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: '#6b6b6b',
      lineHeight: 1.6
    }
  }, "verb \xB7 /\u0259b\u02C8d\u028Ckt/", /*#__PURE__*/React.createElement("br", null), "1. take (someone) away by force or deception; kidnap.", /*#__PURE__*/React.createElement("br", null), "2. (of a muscle) move (a limb or part) away from the midline of the body or from another part.")));
}
window.Dictionary = Dictionary;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/growland-app/Dictionary.jsx", error: String((e && e.message) || e) }); }

// ui_kits/growland-app/Home.jsx
try { (() => {
const {
  TopBar,
  MenuCard,
  ProgressBar
} = window.GrowlandDesignSystem_5ed90c;
function Home({
  onOpen
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      fontFamily: 'var(--font-base)',
      background: '#fff'
    }
  }, /*#__PURE__*/React.createElement(TopBar, {
    name: "Nina Thomas",
    subtitle: "Intermediate"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: 'auto',
      padding: '4px 20px 20px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 700,
      color: '#6b6b6b',
      marginBottom: 8
    }
  }, "Your Progress"), /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#f6f6f6',
      borderRadius: 16,
      padding: 16,
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 13,
      fontWeight: 700,
      color: '#063417',
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("span", null, "Level 5"), /*#__PURE__*/React.createElement("span", null, "250/500 XP")), /*#__PURE__*/React.createElement(ProgressBar, {
    value: 250,
    max: 500
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 700,
      color: '#6b6b6b',
      marginBottom: 8
    }
  }, "Jump in!"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(MenuCard, {
    title: "Speaking Clubs",
    subtitle: "Join & Practice",
    tint: "pink",
    icon: "users",
    onClick: () => onOpen('clubs')
  }), /*#__PURE__*/React.createElement(MenuCard, {
    title: "Chats",
    subtitle: "Connect & Talk",
    tint: "mint",
    icon: "chat",
    onClick: () => onOpen('chats')
  }), /*#__PURE__*/React.createElement(MenuCard, {
    title: "Calendar",
    subtitle: "Plan Your Sessions",
    tint: "amber",
    icon: "calendar",
    onClick: () => onOpen('calendar')
  }), /*#__PURE__*/React.createElement(MenuCard, {
    title: "Dictionary",
    subtitle: "Learn New Words",
    tint: "teal",
    icon: "book",
    onClick: () => onOpen('words')
  }))));
}
window.Home = Home;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/growland-app/Home.jsx", error: String((e && e.message) || e) }); }

// ui_kits/growland-app/Onboarding.jsx
try { (() => {
const {
  Button,
  Input,
  Icon
} = window.GrowlandDesignSystem_5ed90c;
function Screen({
  children,
  bg
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      height: '100%',
      background: bg || '#fff',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'var(--font-base)',
      boxSizing: 'border-box'
    }
  }, children);
}
function HeroBlob() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      overflow: 'hidden',
      borderRadius: 'inherit'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      width: 340,
      height: 340,
      borderRadius: '50%',
      background: 'radial-gradient(circle,#c8eed7,#8adba6)',
      top: 120,
      left: -60,
      opacity: .9
    }
  }));
}
function Mascot({
  size = 120
}) {
  return /*#__PURE__*/React.createElement("img", {
    src: "../../assets/mascot-verify.png",
    style: {
      width: size,
      height: 'auto'
    }
  });
}
function OnboardingSlide({
  onNext,
  onSkip
}) {
  return /*#__PURE__*/React.createElement(Screen, {
    bg: "linear-gradient(180deg,#a8e2bb,#8adba6)"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 32
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#063417',
      color: '#fff',
      fontSize: 13,
      padding: '6px 14px',
      borderRadius: 16,
      marginBottom: 8
    }
  }, "Hello!"), /*#__PURE__*/React.createElement(Mascot, {
    size: 110
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 28px 40px',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-base)',
      fontWeight: 800,
      fontSize: 26,
      color: '#063417',
      letterSpacing: '0.03em',
      marginBottom: 24
    }
  }, "GROWLAND"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      justifyContent: 'center',
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 24,
      height: 4,
      borderRadius: 2,
      background: '#063417'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 24,
      height: 4,
      borderRadius: 2,
      background: 'rgba(6,52,23,.3)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 24,
      height: 4,
      borderRadius: 2,
      background: 'rgba(6,52,23,.3)'
    }
  })), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    fullWidth: true,
    onClick: onNext
  }, "Continue"), /*#__PURE__*/React.createElement("div", {
    onClick: onSkip,
    style: {
      marginTop: 12,
      fontSize: 13,
      color: '#063417',
      opacity: .7,
      cursor: 'pointer'
    }
  }, "Skip")));
}
function RoleSlide({
  onNext
}) {
  const [role, setRole] = React.useState(null);
  return /*#__PURE__*/React.createElement(Screen, null, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '52px 24px 20px',
      fontFamily: 'var(--font-base)',
      fontWeight: 700,
      fontSize: 18,
      textAlign: 'center',
      color: '#063417'
    }
  }, "How would you like to use the app?"), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '20px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("img", {
    onClick: () => setRole('learner'),
    src: "../../assets/illustration-join-club.png",
    style: {
      width: '100%',
      display: 'block',
      borderRadius: 20,
      cursor: 'pointer',
      outline: role === 'learner' ? '2px solid #063417' : 'none'
    }
  }), /*#__PURE__*/React.createElement("img", {
    onClick: () => setRole('moderator'),
    src: "../../assets/illustration-moderator.png",
    style: {
      width: '100%',
      display: 'block',
      borderRadius: 20,
      cursor: 'pointer',
      outline: role === 'moderator' ? '2px solid #063417' : 'none'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 24px 40px'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    fullWidth: true,
    disabled: !role,
    onClick: onNext
  }, "Continue")));
}
function WelcomeSlide({
  onSignUp,
  onLogIn
}) {
  return /*#__PURE__*/React.createElement(Screen, {
    bg: "#f6f6f6"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      position: 'relative',
      background: 'linear-gradient(160deg,#8adba6,#c8eed7)',
      margin: 20,
      borderRadius: 24,
      padding: 28,
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      color: '#063417'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-base)',
      fontWeight: 700,
      fontSize: 22
    }
  }, "Welcome to", /*#__PURE__*/React.createElement("br", null), "GROWLAND!"), [['mic', 'Engage in conversations'], ['users', 'Global community'], ['book', 'Learn together']].map(([ic, label]) => /*#__PURE__*/React.createElement("div", {
    key: label,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      fontSize: 13,
      fontWeight: 600
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: ic,
    size: 18
  }), label.toUpperCase()))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 24px 40px',
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    fullWidth: true,
    onClick: onSignUp
  }, "Sign Up"), /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    fullWidth: true,
    onClick: onLogIn
  }, "Log In")));
}
function Onboarding({
  onDone
}) {
  const [step, setStep] = React.useState(0);
  const [mode, setMode] = React.useState('signup');
  if (step === 0) return /*#__PURE__*/React.createElement(OnboardingSlide, {
    onNext: () => setStep(1),
    onSkip: () => setStep(2)
  });
  if (step === 1) return /*#__PURE__*/React.createElement(RoleSlide, {
    onNext: () => setStep(2)
  });
  return /*#__PURE__*/React.createElement(WelcomeSlide, {
    onSignUp: () => onDone('signup'),
    onLogIn: () => onDone('login')
  });
}
window.Onboarding = Onboarding;
window.OnboardingScreen = Screen;
window.OnboardingMascot = Mascot;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/growland-app/Onboarding.jsx", error: String((e && e.message) || e) }); }

// ui_kits/growland-app/ios-frame.jsx
try { (() => {
// @ds-adherence-ignore -- omelette starter scaffold (raw elements/hex/px by design)
// Copied omelette starter. Re-running copy_starter_component with this kind overwrites this file with the latest version (page content is unaffected).

/* BEGIN USAGE */
// iOS.jsx — Simplified iOS 26 (Liquid Glass) device frame
// Based on the iOS 26 UI Kit + Figma status bar spec. No assets, no deps.
// Exports (to window): IOSDevice, IOSStatusBar, IOSNavBar, IOSGlassPill, IOSList, IOSListRow, IOSKeyboard
//
// Usage — wrap your screen content in <IOSDevice> to get the bezel, status bar
// and home indicator (props: title, dark, keyboard):
//
//   <IOSDevice title="Settings">
//     ...your screen content...
//   </IOSDevice>
//   <IOSDevice dark title="Search" keyboard>…</IOSDevice>
/* END USAGE */

// ─────────────────────────────────────────────────────────────
// Status bar
// ─────────────────────────────────────────────────────────────
function IOSStatusBar({
  dark = false,
  time = '9:41'
}) {
  const c = dark ? '#fff' : '#000';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 154,
      alignItems: 'center',
      justifyContent: 'center',
      padding: '21px 24px 19px',
      boxSizing: 'border-box',
      position: 'relative',
      zIndex: 20,
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 22,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 1.5
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: '-apple-system, "SF Pro", system-ui',
      fontWeight: 590,
      fontSize: 17,
      lineHeight: '22px',
      color: c
    }
  }, time)), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 22,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 7,
      paddingTop: 1,
      paddingRight: 1
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "19",
    height: "12",
    viewBox: "0 0 19 12"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "0",
    y: "7.5",
    width: "3.2",
    height: "4.5",
    rx: "0.7",
    fill: c
  }), /*#__PURE__*/React.createElement("rect", {
    x: "4.8",
    y: "5",
    width: "3.2",
    height: "7",
    rx: "0.7",
    fill: c
  }), /*#__PURE__*/React.createElement("rect", {
    x: "9.6",
    y: "2.5",
    width: "3.2",
    height: "9.5",
    rx: "0.7",
    fill: c
  }), /*#__PURE__*/React.createElement("rect", {
    x: "14.4",
    y: "0",
    width: "3.2",
    height: "12",
    rx: "0.7",
    fill: c
  })), /*#__PURE__*/React.createElement("svg", {
    width: "17",
    height: "12",
    viewBox: "0 0 17 12"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M8.5 3.2C10.8 3.2 12.9 4.1 14.4 5.6L15.5 4.5C13.7 2.7 11.2 1.5 8.5 1.5C5.8 1.5 3.3 2.7 1.5 4.5L2.6 5.6C4.1 4.1 6.2 3.2 8.5 3.2Z",
    fill: c
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8.5 6.8C9.9 6.8 11.1 7.3 12 8.2L13.1 7.1C11.8 5.9 10.2 5.1 8.5 5.1C6.8 5.1 5.2 5.9 3.9 7.1L5 8.2C5.9 7.3 7.1 6.8 8.5 6.8Z",
    fill: c
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "8.5",
    cy: "10.5",
    r: "1.5",
    fill: c
  })), /*#__PURE__*/React.createElement("svg", {
    width: "27",
    height: "13",
    viewBox: "0 0 27 13"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "0.5",
    y: "0.5",
    width: "23",
    height: "12",
    rx: "3.5",
    stroke: c,
    strokeOpacity: "0.35",
    fill: "none"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "2",
    y: "2",
    width: "20",
    height: "9",
    rx: "2",
    fill: c
  }), /*#__PURE__*/React.createElement("path", {
    d: "M25 4.5V8.5C25.8 8.2 26.5 7.2 26.5 6.5C26.5 5.8 25.8 4.8 25 4.5Z",
    fill: c,
    fillOpacity: "0.4"
  }))));
}

// ─────────────────────────────────────────────────────────────
// Liquid glass pill — blur + tint + shine
// ─────────────────────────────────────────────────────────────
function IOSGlassPill({
  children,
  dark = false,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: 44,
      minWidth: 44,
      borderRadius: 9999,
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: dark ? '0 2px 6px rgba(0,0,0,0.35), 0 6px 16px rgba(0,0,0,0.2)' : '0 1px 3px rgba(0,0,0,0.07), 0 3px 10px rgba(0,0,0,0.06)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 9999,
      backdropFilter: 'blur(12px) saturate(180%)',
      WebkitBackdropFilter: 'blur(12px) saturate(180%)',
      background: dark ? 'rgba(120,120,128,0.28)' : 'rgba(255,255,255,0.5)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 9999,
      boxShadow: dark ? 'inset 1.5px 1.5px 1px rgba(255,255,255,0.15), inset -1px -1px 1px rgba(255,255,255,0.08)' : 'inset 1.5px 1.5px 1px rgba(255,255,255,0.7), inset -1px -1px 1px rgba(255,255,255,0.4)',
      border: dark ? '0.5px solid rgba(255,255,255,0.15)' : '0.5px solid rgba(0,0,0,0.06)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      zIndex: 1,
      display: 'flex',
      alignItems: 'center',
      padding: '0 4px'
    }
  }, children));
}

// ─────────────────────────────────────────────────────────────
// Navigation bar — glass pills + large title
// ─────────────────────────────────────────────────────────────
function IOSNavBar({
  title = 'Title',
  dark = false,
  trailingIcon = true
}) {
  const muted = dark ? 'rgba(255,255,255,0.6)' : '#404040';
  const text = dark ? '#fff' : '#000';
  const pillIcon = content => /*#__PURE__*/React.createElement(IOSGlassPill, {
    dark: dark
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 36,
      height: 36,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, content));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      paddingTop: 62,
      paddingBottom: 10,
      position: 'relative',
      zIndex: 5
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px'
    }
  }, pillIcon(/*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "20",
    viewBox: "0 0 12 20",
    fill: "none",
    style: {
      marginLeft: -1
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M10 2L2 10l8 8",
    stroke: muted,
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }))), trailingIcon && pillIcon(/*#__PURE__*/React.createElement("svg", {
    width: "22",
    height: "6",
    viewBox: "0 0 22 6"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "3",
    cy: "3",
    r: "2.5",
    fill: muted
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "3",
    r: "2.5",
    fill: muted
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "19",
    cy: "3",
    r: "2.5",
    fill: muted
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 16px',
      fontFamily: '-apple-system, system-ui',
      fontSize: 34,
      fontWeight: 700,
      lineHeight: '41px',
      color: text,
      letterSpacing: 0.4
    }
  }, title));
}

// ─────────────────────────────────────────────────────────────
// Grouped list (inset card, r:26) + row (52px)
// ─────────────────────────────────────────────────────────────
function IOSListRow({
  title,
  detail,
  icon,
  chevron = true,
  isLast = false,
  dark = false
}) {
  const text = dark ? '#fff' : '#000';
  const sec = dark ? 'rgba(235,235,245,0.6)' : 'rgba(60,60,67,0.6)';
  const ter = dark ? 'rgba(235,235,245,0.3)' : 'rgba(60,60,67,0.3)';
  const sep = dark ? 'rgba(84,84,88,0.65)' : 'rgba(60,60,67,0.12)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      minHeight: 52,
      padding: '0 16px',
      position: 'relative',
      fontFamily: '-apple-system, system-ui',
      fontSize: 17,
      letterSpacing: -0.43
    }
  }, icon && /*#__PURE__*/React.createElement("div", {
    style: {
      width: 30,
      height: 30,
      borderRadius: 7,
      background: icon,
      marginRight: 12,
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      color: text
    }
  }, title), detail && /*#__PURE__*/React.createElement("span", {
    style: {
      color: sec,
      marginRight: 6
    }
  }, detail), chevron && /*#__PURE__*/React.createElement("svg", {
    width: "8",
    height: "14",
    viewBox: "0 0 8 14",
    style: {
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M1 1l6 6-6 6",
    stroke: ter,
    strokeWidth: "2",
    fill: "none",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })), !isLast && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      left: icon ? 58 : 16,
      height: 0.5,
      background: sep
    }
  }));
}
function IOSList({
  header,
  children,
  dark = false
}) {
  const hc = dark ? 'rgba(235,235,245,0.6)' : 'rgba(60,60,67,0.6)';
  const bg = dark ? '#1C1C1E' : '#fff';
  return /*#__PURE__*/React.createElement("div", null, header && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '-apple-system, system-ui',
      fontSize: 13,
      color: hc,
      textTransform: 'uppercase',
      padding: '8px 36px 6px',
      letterSpacing: -0.08
    }
  }, header), /*#__PURE__*/React.createElement("div", {
    style: {
      background: bg,
      borderRadius: 26,
      margin: '0 16px',
      overflow: 'hidden'
    }
  }, children));
}

// ─────────────────────────────────────────────────────────────
// Device frame
// ─────────────────────────────────────────────────────────────
function IOSDevice({
  children,
  width = 402,
  height = 874,
  dark = false,
  title,
  keyboard = false
}) {
  return (
    /*#__PURE__*/
    // data-om-starter: inert presence marker — Claude Design's starter-usage
    // probe reads it; it renders nothing. Keep it on this root element.
    React.createElement("div", {
      "data-om-starter": "ios-frame",
      style: {
        width,
        height,
        borderRadius: 48,
        overflow: 'hidden',
        position: 'relative',
        background: dark ? '#000' : '#F2F2F7',
        boxShadow: '0 40px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.12)',
        fontFamily: '-apple-system, system-ui, sans-serif',
        WebkitFontSmoothing: 'antialiased'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: 11,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 126,
        height: 37,
        borderRadius: 24,
        background: '#000',
        zIndex: 50
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10
      }
    }, /*#__PURE__*/React.createElement(IOSStatusBar, {
      dark: dark
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }
    }, title !== undefined && /*#__PURE__*/React.createElement(IOSNavBar, {
      title: title,
      dark: dark
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        overflow: 'auto'
      }
    }, children), keyboard && /*#__PURE__*/React.createElement(IOSKeyboard, {
      dark: dark
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 60,
        height: 34,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingBottom: 8,
        pointerEvents: 'none'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 139,
        height: 5,
        borderRadius: 100,
        background: dark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.25)'
      }
    })))
  );
}

// ─────────────────────────────────────────────────────────────
// Keyboard — iOS 26 liquid glass
// ─────────────────────────────────────────────────────────────
function IOSKeyboard({
  dark = false
}) {
  const glyph = dark ? 'rgba(255,255,255,0.7)' : '#595959';
  const sugg = dark ? 'rgba(255,255,255,0.6)' : '#333';
  const keyBg = dark ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.85)';

  // special-key icons
  const icons = {
    shift: /*#__PURE__*/React.createElement("svg", {
      width: "19",
      height: "17",
      viewBox: "0 0 19 17"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M9.5 1L1 9.5h4.5V16h8V9.5H18L9.5 1z",
      fill: glyph
    })),
    del: /*#__PURE__*/React.createElement("svg", {
      width: "23",
      height: "17",
      viewBox: "0 0 23 17"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M7 1h13a2 2 0 012 2v11a2 2 0 01-2 2H7l-6-7.5L7 1z",
      fill: "none",
      stroke: glyph,
      strokeWidth: "1.6",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M10 5l7 7M17 5l-7 7",
      stroke: glyph,
      strokeWidth: "1.6",
      strokeLinecap: "round"
    })),
    ret: /*#__PURE__*/React.createElement("svg", {
      width: "20",
      height: "14",
      viewBox: "0 0 20 14"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M18 1v6H4m0 0l4-4M4 7l4 4",
      fill: "none",
      stroke: "#fff",
      strokeWidth: "1.8",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }))
  };
  const key = (content, {
    w,
    flex,
    ret,
    fs = 25,
    k
  } = {}) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      height: 42,
      borderRadius: 8.5,
      flex: flex ? 1 : undefined,
      width: w,
      minWidth: 0,
      background: ret ? '#08f' : keyBg,
      boxShadow: '0 1px 0 rgba(0,0,0,0.075)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '-apple-system, "SF Compact", system-ui',
      fontSize: fs,
      fontWeight: 458,
      color: ret ? '#fff' : glyph
    }
  }, content);
  const row = (keys, pad = 0) => /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6.5,
      justifyContent: 'center',
      padding: `0 ${pad}px`
    }
  }, keys.map(l => key(l, {
    flex: true,
    k: l
  })));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      zIndex: 15,
      borderRadius: 27,
      overflow: 'hidden',
      padding: '11px 0 2px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      boxShadow: dark ? '0 -2px 20px rgba(0,0,0,0.09)' : '0 -1px 6px rgba(0,0,0,0.018), 0 -3px 20px rgba(0,0,0,0.012)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 27,
      backdropFilter: 'blur(12px) saturate(180%)',
      WebkitBackdropFilter: 'blur(12px) saturate(180%)',
      background: dark ? 'rgba(120,120,128,0.14)' : 'rgba(255,255,255,0.25)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 27,
      boxShadow: dark ? 'inset 1.5px 1.5px 1px rgba(255,255,255,0.15)' : 'inset 1.5px 1.5px 1px rgba(255,255,255,0.7), inset -1px -1px 1px rgba(255,255,255,0.4)',
      border: dark ? '0.5px solid rgba(255,255,255,0.15)' : '0.5px solid rgba(0,0,0,0.06)',
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 20,
      alignItems: 'center',
      padding: '8px 22px 13px',
      width: '100%',
      boxSizing: 'border-box',
      position: 'relative'
    }
  }, ['"The"', 'the', 'to'].map((w, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: i
  }, i > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1,
      height: 25,
      background: '#ccc',
      opacity: 0.3
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      textAlign: 'center',
      fontFamily: '-apple-system, system-ui',
      fontSize: 17,
      color: sugg,
      letterSpacing: -0.43,
      lineHeight: '22px'
    }
  }, w)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 13,
      padding: '0 6.5px',
      width: '100%',
      boxSizing: 'border-box',
      position: 'relative'
    }
  }, row(['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p']), row(['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'], 20), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14.25,
      alignItems: 'center'
    }
  }, key(icons.shift, {
    w: 45,
    k: 'shift'
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6.5,
      flex: 1
    }
  }, ['z', 'x', 'c', 'v', 'b', 'n', 'm'].map(l => key(l, {
    flex: true,
    k: l
  }))), key(icons.del, {
    w: 45,
    k: 'del'
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      alignItems: 'center'
    }
  }, key('ABC', {
    w: 92.25,
    fs: 18,
    k: 'abc'
  }), key('', {
    flex: true,
    k: 'space'
  }), key(icons.ret, {
    w: 92.25,
    ret: true,
    k: 'ret'
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 56,
      width: '100%',
      position: 'relative'
    }
  }));
}
Object.assign(window, {
  IOSDevice,
  IOSStatusBar,
  IOSNavBar,
  IOSGlassPill,
  IOSList,
  IOSListRow,
  IOSKeyboard
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/growland-app/ios-frame.jsx", error: String((e && e.message) || e) }); }

__ds_ns.ClubCard = __ds_scope.ClubCard;

__ds_ns.ListItem = __ds_scope.ListItem;

__ds_ns.MenuCard = __ds_scope.MenuCard;

__ds_ns.Avatar = __ds_scope.Avatar;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.OtpInput = __ds_scope.OtpInput;

__ds_ns.ProgressBar = __ds_scope.ProgressBar;

__ds_ns.TabBar = __ds_scope.TabBar;

__ds_ns.TopBar = __ds_scope.TopBar;

})();
