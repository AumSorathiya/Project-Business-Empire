# Empire Architect: Design System and UX Specification

## 1. Design intent

Create a premium, calm, information-rich business dashboard. It should feel like operating a modern empire, not managing a spreadsheet.

The visual language must be original and consistent across every screen.

## 2. Brand direction

Working title: **Empire Architect**  
Mood: strategic, confident, modern, quietly luxurious.  
Primary accent: restrained metallic gold.  
Primary background: deep charcoal or midnight navy.

Avoid excessive glow, noisy gradients, and gold on every component. Gold highlights important actions, progression, and value.

## 3. Color tokens

Suggested CSS tokens:
```css
:root {
  --color-bg: #0B0E13;
  --color-surface: #121720;
  --color-surface-raised: #191F2A;
  --color-border: #2A3240;
  --color-gold: #D6AD58;
  --color-gold-hover: #E6C577;
  --color-text: #F3F5F7;
  --color-text-muted: #A0A9B7;
  --color-positive: #4BC58A;
  --color-negative: #F07878;
  --radius-sm: 8px;
  --radius-md: 14px;
  --radius-lg: 20px;
}
```

Treat these as initial tokens and verify contrast before release.

## 4. Typography

- Use a highly legible sans-serif for general interface text.
- Use tabular numerals for financial values where supported.
- Headings should be concise and clearly differentiated.
- Avoid using very small text for costs, income, or unlock requirements.
- Use a consistent number-formatting policy throughout the game.

Use local or properly licensed fonts. The game must remain legible if a custom font fails to load.

## 5. Layout

### Desktop
- Left sidebar navigation.
- Top financial status bar.
- Main content region with dashboard cards.
- Optional contextual panel for milestones or recommendations.

### Sidebar
- Dashboard
- Businesses
- Upgrades
- Achievements
- Statistics
- Settings

### Top bar
- Cash.
- Net worth.
- Net income/sec.
- Empire level.
- Save status.

### Dashboard
- Income overview.
- Portfolio summary.
- Owned business cards.
- Next milestone.
- Recent achievements.
- Suggested next investments.

### Mobile
- Compact navigation.
- Stacked metric cards.
- Single-column business cards.
- Touch-friendly controls.
- No horizontal overflow.

## 6. Business cards

Every card should show:
- Original icon/illustration.
- Business name and short description.
- Owned quantity.
- Current purchase cost.
- Net income contribution.
- Upgrade level.
- Locked/unlocked status.
- Purchase or upgrade action.

When possible, show the expected income delta and payback estimate before the player commits.

## 7. Interaction states

All interactive controls need:
- Default state.
- Hover state where applicable.
- Visible keyboard focus.
- Pressed state.
- Disabled state with explanation.
- Success/failure feedback for transactions.

Prevent repeated clicks from applying the same transaction twice if an action is temporarily processing.

## 8. Motion

Use restrained transitions for:
- Cash changes.
- Progress bars.
- Achievement unlocks.
- Screen navigation.
- Purchase confirmations.

Respect `prefers-reduced-motion`. Motion must never be required to understand a financial state.

## 9. Charts and financial presentation

Charts should answer specific questions: Is income rising? Which business contributes most? How close is the next milestone?

Avoid decorative charts without meaningful data. Use accessible labels, tooltips, and text summaries where needed.

## 10. Accessibility

- Keyboard navigation for all essential controls.
- Clear focus indicators.
- Accessible labels for icon-only buttons.
- Adequate text and control contrast.
- Do not use color as the sole signal for profit/loss.
- Respect reduced motion.
- Avoid essential information available only on hover.
- Use semantic headings and buttons.
- Announce important achievements and transaction feedback appropriately.

## 11. Original asset policy

Use original CSS/SVG artwork, original icons, or properly licensed assets. Maintain attribution records for assets that require them. Do not reproduce another game's proprietary artwork, exact UI, names, or descriptions.

## 12. Design acceptance criteria

- The dashboard is visually consistent.
- Cash and income are immediately discoverable.
- Business purchase cost and income effect are clear.
- Gold is an accent rather than a wall-to-wall color.
- Layout works at common desktop and mobile sizes.
- Keyboard focus is visible.
- Reduced-motion mode works.
- No critical text is clipped or unreadable.
