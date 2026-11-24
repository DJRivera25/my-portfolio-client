"use client";

import React from "react";
import { worklogContent } from "../../config/worklog";
import type { WorkEntryFilterValue } from "../../types/worklog";

interface Props {
  value: WorkEntryFilterValue;
  onChange: (next: WorkEntryFilterValue) => void;
}

const FIELD = "at-field py-2 text-[13px]";
const DATE_LABEL =
  "flex items-center gap-2 font-codet text-[10px] tracking-[0.06em] text-atelier-faint";

const WorkEntryFilters: React.FC<Props> = ({ value, onChange }) => {
  const update =
    (key: keyof WorkEntryFilterValue) => (event: React.ChangeEvent<HTMLInputElement>) =>
      onChange({ ...value, [key]: event.target.value });

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      <input
        type="search"
        value={value.text}
        onChange={update("text")}
        placeholder={worklogContent.searchPlaceholder}
        aria-label={worklogContent.searchPlaceholder}
        className={`${FIELD} min-w-[220px] flex-[2]`}
      />
      <input
        type="text"
        value={value.waitingOn}
        onChange={update("waitingOn")}
        placeholder={worklogContent.waitingOnPlaceholder}
        aria-label={worklogContent.waitingOnPlaceholder}
        className={`${FIELD} min-w-[150px] flex-1`}
      />
      <label className={DATE_LABEL}>
        {worklogContent.fromLabel.toUpperCase()}
        <input
          type="date"
          value={value.from}
          max={value.to || undefined}
          onChange={update("from")}
          className={`${FIELD} w-auto [color-scheme:dark]`}
        />
      </label>
      <label className={DATE_LABEL}>
        {worklogContent.toLabel.toUpperCase()}
        <input
          type="date"
          value={value.to}
          min={value.from || undefined}
          onChange={update("to")}
          className={`${FIELD} w-auto [color-scheme:dark]`}
        />
      </label>
    </div>
  );
};

export default WorkEntryFilters;
