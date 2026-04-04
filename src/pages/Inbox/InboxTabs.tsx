import "./InboxTabs.css";

export type InboxTab = "messages" | "comments";

type Props = {
  active: InboxTab;
  onChange: (tab: InboxTab) => void;
};

export function InboxTabs({ active, onChange }: Props) {
  return (
    <nav className="inbox-tabs" aria-label="Inbox sections">
      <button
        type="button"
        className={`inbox-tab${active === "messages" ? " inbox-tab-active" : ""}`}
        onClick={() => onChange("messages")}
        aria-pressed={active === "messages"}
      >
        Messages
      </button>
      <button
        type="button"
        className={`inbox-tab${active === "comments" ? " inbox-tab-active" : ""}`}
        onClick={() => onChange("comments")}
        aria-pressed={active === "comments"}
      >
        Comments
      </button>
    </nav>
  );
}
