"use client";

import * as React from "react";
import type { ReactNode } from "react";
import {
  Button as _TrussButton,
  ButtonGroup as _TrussButtonGroup,
  Alert as _TrussAlert,
  Tag as _Tag,
  Link as _TrussLink,
  Card as _TrussCard,
  CardBody as _CardBody,
  Accordion as _TrussAccordion,
  Table as _TrussTable,
  TextInput as _TrussTextInput,
  Select as _TrussSelect,
  Textarea as _TrussTextarea,
  Checkbox as _TrussCheckbox,
  Radio as _TrussRadio,
  FormGroup as _TrussFormGroup,
  Label as _TrussLabel,
  Pagination as _TrussPagination,
  Tooltip as _TrussTooltip,
  Grid as _TrussGrid,
  GridContainer as _TrussGridContainer,
  Icon as TrussIcon,
  SiteAlert as _TrussSiteAlert,
  BreadcrumbBar as _TrussBreadcrumbBar,
  Breadcrumb as _TrussBreadcrumb,
  SideNav as _TrussSideNav,
  InPageNavigation as _TrussInPageNavigation,
  StepIndicator as _TrussStepIndicator,
  StepIndicatorStep as _TrussStepIndicatorStep,
  ProcessList as _TrussProcessList,
  ProcessListItem as _TrussProcessListItem,
  SummaryBox as _TrussSummaryBox,
  SummaryBoxHeading as _TrussSummaryBoxHeading,
  Search as _TrussSearch,
  GovBanner as _TrussGovBanner,
  Collection as _TrussCollection,
  CollectionItem as _TrussCollectionItem,
  CollectionHeading as _TrussCollectionHeading,
  CollectionDescription as _TrussCollectionDescription,
  CollectionMeta as _TrussCollectionMeta,
  CollectionMetaItem as _TrussCollectionMetaItem,
  Identifier as _TrussIdentifier,
  IdentifierMasthead as _TrussIdentifierMasthead,
  IdentifierLogos as _TrussIdentifierLogos,
  IdentifierLogo as _TrussIdentifierLogo,
  IdentifierIdentity as _TrussIdentifierIdentity,
  IdentifierLinks as _TrussIdentifierLinks,
  IdentifierLinkItem as _TrussIdentifierLinkItem,
  IdentifierLink as _TrussIdentifierLink,
  IdentifierGov as _TrussIdentifierGov,
  Header as _TrussHeader,
  Title as _TrussTitle,
  NavMenuButton as _TrussNavMenuButton,
  PrimaryNav as _TrussPrimaryNav,
  Footer as _TrussFooter,
  FooterNav as _TrussFooterNav,
  Logo as _TrussLogo,
  LanguageSelector as _TrussLanguageSelector,
  IconList as _TrussIconList,
  IconListItem as _TrussIconListItem,
  IconListIcon as _TrussIconListIcon,
  IconListContent as _TrussIconListContent,
  MediaBlockBody as _TrussMediaBlockBody,
  ComboBox as _TrussComboBox,
  DatePicker as _TrussDatePicker,
  DateRangePicker as _TrussDateRangePicker,
  FileInput as _TrussFileInput,
  RangeInput as _TrussRangeInput,
  TimePicker as _TrussTimePicker,
  CharacterCount as _TrussCharacterCount,
  TextInputMask as _TrussTextInputMask,
  ErrorMessage as _TrussErrorMessage,
} from "@trussworks/react-uswds";
import type { UswdsProps } from "./catalog";

// Truss components return ReactElement; React 18 @types/react expects ReactNode
// from JSX function components. Cast once here so every usage site is clean.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TrussButton = _TrussButton as unknown as React.FC<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TrussButtonGroup = _TrussButtonGroup as unknown as React.FC<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TrussAlert = _TrussAlert as unknown as React.FC<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Tag = _Tag as unknown as React.FC<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TrussLink = _TrussLink as unknown as React.FC<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TrussCard = _TrussCard as unknown as React.FC<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CardBody = _CardBody as unknown as React.FC<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TrussAccordion = _TrussAccordion as unknown as React.FC<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TrussTable = _TrussTable as unknown as React.FC<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TrussTextInput = _TrussTextInput as unknown as React.FC<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TrussSelect = _TrussSelect as unknown as React.FC<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TrussTextarea = _TrussTextarea as unknown as React.FC<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TrussCheckbox = _TrussCheckbox as unknown as React.FC<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TrussRadio = _TrussRadio as unknown as React.FC<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TrussFormGroup = _TrussFormGroup as unknown as React.FC<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TrussLabel = _TrussLabel as unknown as React.FC<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TrussPagination = _TrussPagination as unknown as React.FC<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TrussTooltip = _TrussTooltip as unknown as React.FC<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TrussGrid = _TrussGrid as unknown as React.FC<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TrussGridContainer = _TrussGridContainer as unknown as React.FC<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TrussSiteAlert = _TrussSiteAlert as unknown as React.FC<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TrussBreadcrumbBar = _TrussBreadcrumbBar as unknown as React.FC<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TrussBreadcrumb = _TrussBreadcrumb as unknown as React.FC<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TrussSideNav = _TrussSideNav as unknown as React.FC<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TrussInPageNavigation = _TrussInPageNavigation as unknown as React.FC<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TrussStepIndicator = _TrussStepIndicator as unknown as React.FC<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TrussStepIndicatorStep = _TrussStepIndicatorStep as unknown as React.FC<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TrussProcessList = _TrussProcessList as unknown as React.FC<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TrussProcessListItem = _TrussProcessListItem as unknown as React.FC<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TrussSummaryBox = _TrussSummaryBox as unknown as React.FC<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TrussSummaryBoxHeading = _TrussSummaryBoxHeading as unknown as React.FC<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TrussSearch = _TrussSearch as unknown as React.FC<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TrussGovBanner = _TrussGovBanner as unknown as React.FC<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TrussCollection = _TrussCollection as unknown as React.FC<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TrussCollectionItem = _TrussCollectionItem as unknown as React.FC<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TrussCollectionHeading = _TrussCollectionHeading as unknown as React.FC<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TrussCollectionDescription = _TrussCollectionDescription as unknown as React.FC<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TrussCollectionMeta = _TrussCollectionMeta as unknown as React.FC<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TrussCollectionMetaItem = _TrussCollectionMetaItem as unknown as React.FC<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TrussIdentifier = _TrussIdentifier as unknown as React.FC<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TrussIdentifierMasthead = _TrussIdentifierMasthead as unknown as React.FC<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TrussIdentifierLogos = _TrussIdentifierLogos as unknown as React.FC<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TrussIdentifierLogo = _TrussIdentifierLogo as unknown as React.FC<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TrussIdentifierIdentity = _TrussIdentifierIdentity as unknown as React.FC<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TrussIdentifierLinks = _TrussIdentifierLinks as unknown as React.FC<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TrussIdentifierLinkItem = _TrussIdentifierLinkItem as unknown as React.FC<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TrussIdentifierLink = _TrussIdentifierLink as unknown as React.FC<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TrussIdentifierGov = _TrussIdentifierGov as unknown as React.FC<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TrussHeader = _TrussHeader as unknown as React.FC<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TrussTitle = _TrussTitle as unknown as React.FC<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TrussNavMenuButton = _TrussNavMenuButton as unknown as React.FC<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TrussPrimaryNav = _TrussPrimaryNav as unknown as React.FC<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TrussFooter = _TrussFooter as unknown as React.FC<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TrussFooterNav = _TrussFooterNav as unknown as React.FC<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TrussLogo = _TrussLogo as unknown as React.FC<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TrussLanguageSelector = _TrussLanguageSelector as unknown as React.FC<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TrussIconList = _TrussIconList as unknown as React.FC<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TrussIconListItem = _TrussIconListItem as unknown as React.FC<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TrussIconListIcon = _TrussIconListIcon as unknown as React.FC<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TrussIconListContent = _TrussIconListContent as unknown as React.FC<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TrussMediaBlockBody = _TrussMediaBlockBody as unknown as React.FC<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TrussComboBox = _TrussComboBox as unknown as React.FC<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TrussDatePicker = _TrussDatePicker as unknown as React.FC<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TrussDateRangePicker = _TrussDateRangePicker as unknown as React.FC<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TrussFileInput = _TrussFileInput as unknown as React.FC<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TrussRangeInput = _TrussRangeInput as unknown as React.FC<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TrussTimePicker = _TrussTimePicker as unknown as React.FC<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TrussCharacterCount = _TrussCharacterCount as unknown as React.FC<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TrussTextInputMask = _TrussTextInputMask as unknown as React.FC<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TrussErrorMessage = _TrussErrorMessage as unknown as React.FC<any>;

export type Envelope<P> = {
  props?: Partial<P>;
  emit?: (event: string) => void;
  children?: ReactNode;
};

// ── Button ───────────────────────────────────────────────────────────────────
type ButtonAdapterProps = Partial<UswdsProps["Button"]> & Envelope<UswdsProps["Button"]>;

function Button(all: ButtonAdapterProps) {
  const { props: envelopeProps, emit, children, ...rest } = all;
  const p = { ...rest, ...(envelopeProps ?? {}) };

  const rawClick = (p as unknown as { onClick?: unknown }).onClick;
  const nativeOnClick =
    !emit && typeof rawClick === "function"
      ? (rawClick as React.MouseEventHandler<HTMLButtonElement>)
      : undefined;

  const variant = p.variant ?? "default";
  const secondary = variant === "secondary";
  const base = variant === "base";
  const accentStyle: "cool" | "warm" | undefined =
    variant === "accent-cool" ? "cool" : variant === "accent-warm" ? "warm" : undefined;
  const outline = variant === "outline";
  const unstyled = variant === "unstyled";

  return (
    <TrussButton
      type={p.type ?? "button"}
      secondary={secondary || undefined}
      base={base || undefined}
      accentStyle={accentStyle}
      outline={outline || undefined}
      unstyled={unstyled || undefined}
      size={p.size === "big" ? "big" : undefined}
      disabled={p.disabled ?? false}
      onClick={emit ? () => emit("press") : nativeOnClick}
    >
      {children}
    </TrussButton>
  );
}

// ── ButtonGroup ──────────────────────────────────────────────────────────────
type ButtonGroupAdapterProps = Partial<UswdsProps["ButtonGroup"]> & Envelope<UswdsProps["ButtonGroup"]>;

function ButtonGroup(all: ButtonGroupAdapterProps) {
  const { props: envelopeProps, emit: _emit, children, ...rest } = all;
  const p = { ...rest, ...(envelopeProps ?? {}) };

  return (
    <TrussButtonGroup
      type={p.type === "segmented" ? "segmented" : "default"}
    >
      {children}
    </TrussButtonGroup>
  );
}

// ── Alert ────────────────────────────────────────────────────────────────────
type AlertAdapterProps = Partial<UswdsProps["Alert"]> & Envelope<UswdsProps["Alert"]>;

function Alert(all: AlertAdapterProps) {
  const { props: envelopeProps, emit: _emit, children, ...rest } = all;
  const p = { ...rest, ...(envelopeProps ?? {}) };

  const rawType = p.type ?? p.variant;
  const resolvedType: "success" | "warning" | "error" | "info" =
    rawType === "emergency" ? "error" : (rawType as "success" | "warning" | "error" | "info") ?? "info";

  return (
    <TrussAlert
      type={resolvedType}
      heading={p.heading ?? undefined}
      headingLevel={(p.headingLevel as "h1" | "h2" | "h3" | "h4" | "h5" | "h6") ?? "h4"}
      slim={p.slim ?? undefined}
      noIcon={p.noIcon ?? undefined}
      role="alert"
    >
      {p.text ?? children}
    </TrussAlert>
  );
}

// ── Badge (Tag) ───────────────────────────────────────────────────────────────
type BadgeAdapterProps = Partial<UswdsProps["Badge"]> & Envelope<UswdsProps["Badge"]>;

function Badge(all: BadgeAdapterProps) {
  const { props: envelopeProps, emit: _emit, children, ...rest } = all;
  const p = { ...rest, ...(envelopeProps ?? {}) };

  return (
    <Tag background={p.background ?? undefined}>
      {p.text ?? children}
    </Tag>
  );
}

// ── Link ──────────────────────────────────────────────────────────────────────
type LinkAdapterProps = Partial<UswdsProps["Link"]> & Envelope<UswdsProps["Link"]> & { href?: string };

function Link(all: LinkAdapterProps) {
  const { props: envelopeProps, emit: _emit, children, ...rest } = all;
  const p = { ...rest, ...(envelopeProps ?? {}) };

  return (
    <TrussLink
      href={p.href ?? "#"}
      variant={p.variant ?? undefined}
    >
      {p.label ?? children}
    </TrussLink>
  );
}

// ── Card ─────────────────────────────────────────────────────────────────────
type CardAdapterProps = Partial<UswdsProps["Card"]> & Envelope<UswdsProps["Card"]>;

function Card(all: CardAdapterProps) {
  const { props: envelopeProps, emit: _emit, children, ...rest } = all;
  const p = { ...rest, ...(envelopeProps ?? {}) };

  const layoutClass =
    p.layout === "flagDefault" ? "usa-card--flag"
    : p.layout === "flagMediaRight" ? "usa-card--flag usa-card--media-right"
    : undefined;

  return (
    <div className={["usa-card", layoutClass].filter(Boolean).join(" ")}>
      <div className="usa-card__container">
        <div className="usa-card__body">{children}</div>
      </div>
    </div>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────
type SectionAdapterProps = Partial<UswdsProps["Section"]> & Envelope<UswdsProps["Section"]>;

function Section(all: SectionAdapterProps) {
  const { props: _props, emit: _emit, children } = all;
  return <div>{children}</div>;
}

// ── Heading ───────────────────────────────────────────────────────────────────
type HeadingAdapterProps = Partial<UswdsProps["Heading"]> & Envelope<UswdsProps["Heading"]>;

function Heading(all: HeadingAdapterProps) {
  const { props: envelopeProps, emit: _emit, children, ...rest } = all;
  const p = { ...rest, ...(envelopeProps ?? {}) };

  const level = p.level ?? "h2";
  const content = p.text ?? children;

  return <div className="usa-prose">{React.createElement(level, {}, content)}</div>;
}

// ── Text ──────────────────────────────────────────────────────────────────────
const TEXT_SIZE_CLASS: Record<string, string> = {
  xs: "font-sans-xs",
  sm: "font-sans-sm",
  base: "font-sans-md",
  lg: "font-sans-lg",
  xl: "font-sans-xl",
};

type TextAdapterProps = Partial<UswdsProps["Text"]> & Envelope<UswdsProps["Text"]>;

function Text(all: TextAdapterProps) {
  const { props: envelopeProps, emit: _emit, children, ...rest } = all;
  const p = { ...rest, ...(envelopeProps ?? {}) };

  const tag = p.as ?? "p";
  const sizeClass = p.size ? TEXT_SIZE_CLASS[p.size] : undefined;
  const content = p.text ?? children;

  return React.createElement(tag, { className: sizeClass }, content);
}

// ── Accordion ─────────────────────────────────────────────────────────────────
type AccordionItem = {
  id: string;
  title: string;
  content: string;
  expanded: boolean;
  headingLevel?: "h2" | "h3" | "h4" | "h5" | "h6" | null;
};

type AccordionAdapterProps = Partial<UswdsProps["Accordion"]> & Envelope<UswdsProps["Accordion"]>;

function Accordion(all: AccordionAdapterProps) {
  const { props: envelopeProps, emit: _emit, children: _children, ...rest } = all;
  const p = { ...rest, ...(envelopeProps ?? {}) };

  const items = (p.items ?? []) as AccordionItem[];
  const trussItems = items.map((item) => ({
    id: item.id,
    title: item.title as React.ReactNode,
    content: item.content as React.ReactNode,
    expanded: item.expanded,
    headingLevel: (item.headingLevel ?? "h4") as "h2" | "h3" | "h4" | "h5" | "h6",
  }));

  return (
    <TrussAccordion
      bordered={p.bordered ?? undefined}
      multiselectable={p.multiselectable ?? undefined}
      items={trussItems}
    />
  );
}

// ── Table ─────────────────────────────────────────────────────────────────────
type TableAdapterProps = Partial<UswdsProps["Table"]> & Envelope<UswdsProps["Table"]>;

function Table(all: TableAdapterProps) {
  const { props: envelopeProps, emit: _emit, children: _children, ...rest } = all;
  const p = { ...rest, ...(envelopeProps ?? {}) };

  // Table renders a bare <table> — no arbitrary React children are valid inside
  // <table> (only <thead>/<tbody>/<tr> etc.). Drop children to prevent hydration
  // errors when the AI places Section/Card/div-rendering elements inside Table.
  return (
    <TrussTable
      bordered={p.bordered ?? undefined}
      caption={p.caption ?? undefined}
      fullWidth={p.fullWidth ?? undefined}
      fixed={p.fixed ?? undefined}
      scrollable={p.scrollable ?? undefined}
      striped={p.striped ?? undefined}
      compact={p.compact ?? undefined}
      stackedStyle={p.stackedStyle ?? undefined}
      stickyHeader={p.stickyHeader ?? undefined}
    />
  );
}

// ── Input (TextInput) ─────────────────────────────────────────────────────────
type InputAdapterProps = Partial<UswdsProps["Input"]> & Envelope<UswdsProps["Input"]>;

function Input(all: InputAdapterProps) {
  const { props: envelopeProps, emit: _emit, children: _children, ...rest } = all;
  const p = { ...rest, ...(envelopeProps ?? {}) };

  const {
    id: idProp,
    name: nameProp,
    label,
    hint,
    type,
    validationStatus,
    inputSize,
    placeholder,
    defaultValue,
    disabled,
    required,
    ...passthrough
  } = p;

  const id = idProp ?? "input";
  const name = nameProp ?? id;

  const input = (
    <TrussTextInput
      id={id}
      name={name}
      type={type ?? "text"}
      validationStatus={validationStatus ?? undefined}
      inputSize={inputSize ?? undefined}
      placeholder={placeholder ?? undefined}
      defaultValue={
        defaultValue !== undefined && !("value" in passthrough)
          ? defaultValue
          : undefined
      }
      disabled={disabled ?? false}
      required={required ?? undefined}
      {...passthrough}
    />
  );

  if (!label) return input;

  return (
    <TrussFormGroup>
      <TrussLabel htmlFor={id}>{label}</TrussLabel>
      {hint && (
        <span className="usa-hint" id={`${id}-hint`}>
          {hint}
        </span>
      )}
      {input}
    </TrussFormGroup>
  );
}

// ── Textarea ──────────────────────────────────────────────────────────────────
type TextareaAdapterProps = Partial<UswdsProps["Textarea"]> & Envelope<UswdsProps["Textarea"]>;

function Textarea(all: TextareaAdapterProps) {
  const { props: envelopeProps, emit: _emit, children: _children, ...rest } = all;
  const p = { ...rest, ...(envelopeProps ?? {}) };

  const {
    id: idProp,
    name: nameProp,
    label,
    hint,
    placeholder,
    rows,
    defaultValue,
    disabled,
    required,
    error,
    ...passthrough
  } = p;

  const id = idProp ?? "textarea";
  const name = nameProp ?? id;

  const ta = (
    <TrussTextarea
      id={id}
      name={name}
      placeholder={placeholder ?? undefined}
      rows={rows ?? undefined}
      defaultValue={
        defaultValue !== undefined && !("value" in passthrough)
          ? defaultValue
          : undefined
      }
      disabled={disabled ?? false}
      required={required ?? undefined}
      error={error ?? undefined}
      {...passthrough}
    />
  );

  if (!label) return ta;

  return (
    <TrussFormGroup>
      <TrussLabel htmlFor={id}>{label}</TrussLabel>
      {hint && (
        <span className="usa-hint" id={`${id}-hint`}>
          {hint}
        </span>
      )}
      {ta}
    </TrussFormGroup>
  );
}

// ── Select ────────────────────────────────────────────────────────────────────
type SelectOption = { value: string; label: string };
type SelectAdapterProps = Partial<UswdsProps["Select"]> & Envelope<UswdsProps["Select"]>;

function Select(all: SelectAdapterProps) {
  const { props: envelopeProps, emit: _emit, children: _children, ...rest } = all;
  const p = { ...rest, ...(envelopeProps ?? {}) };

  const id = p.id ?? "select";
  const name = p.name ?? id;
  const options = (p.options ?? []) as SelectOption[];

  const select = (
    <TrussSelect
      id={id}
      name={name}
      validationStatus={p.validationStatus ?? undefined}
      defaultValue={p.defaultValue ?? undefined}
      disabled={p.disabled ?? false}
      required={p.required ?? undefined}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </TrussSelect>
  );

  if (!p.label) return select;

  return (
    <TrussFormGroup>
      <TrussLabel htmlFor={id}>{p.label}</TrussLabel>
      {select}
    </TrussFormGroup>
  );
}

// ── Checkbox ──────────────────────────────────────────────────────────────────
type CheckboxAdapterProps = Partial<UswdsProps["Checkbox"]> & Envelope<UswdsProps["Checkbox"]>;

function Checkbox(all: CheckboxAdapterProps) {
  const { props: envelopeProps, emit: _emit, children: _children, ...rest } = all;
  const p = { ...rest, ...(envelopeProps ?? {}) };

  return (
    <TrussCheckbox
      id={p.id ?? "checkbox"}
      name={p.name ?? "checkbox"}
      label={p.label ?? ""}
      tile={p.tile ?? undefined}
      labelDescription={p.labelDescription ?? undefined}
      defaultChecked={p.defaultChecked ?? undefined}
      disabled={p.disabled ?? false}
    />
  );
}

// ── Radio ─────────────────────────────────────────────────────────────────────
type RadioAdapterProps = Partial<UswdsProps["Radio"]> & Envelope<UswdsProps["Radio"]>;

function Radio(all: RadioAdapterProps) {
  const { props: envelopeProps, emit: _emit, children: _children, ...rest } = all;
  const p = { ...rest, ...(envelopeProps ?? {}) };

  return (
    <TrussRadio
      id={p.id ?? "radio"}
      name={p.name ?? "radio"}
      label={p.label ?? ""}
      tile={p.tile ?? undefined}
      labelDescription={p.labelDescription ?? undefined}
      defaultChecked={p.defaultChecked ?? undefined}
      disabled={p.disabled ?? false}
    />
  );
}

// ── Modal ─────────────────────────────────────────────────────────────────────
type ModalAdapterProps = Partial<UswdsProps["Modal"]> & Envelope<UswdsProps["Modal"]>;

function Modal(all: ModalAdapterProps) {
  const { props: envelopeProps, emit: _emit, children, ...rest } = all;
  const p = { ...rest, ...(envelopeProps ?? {}) };

  if (!p.open) return null;

  const id = p.id ?? "modal";
  const sizeClass = p.isLarge ? "usa-modal--lg" : "";
  const className = ["usa-modal", sizeClass].filter(Boolean).join(" ");

  // Render USWDS modal markup directly to avoid jsdom focus-trap activation.
  // TrussModal's isInitiallyOpen triggers focus-trap which requires tabbable
  // nodes — not reliably available in jsdom. Direct markup keeps full
  // accessibility semantics (role=dialog, aria-modal, aria-labelledby) without
  // the focus-trap side-effect.
  return (
    <div
      id={id}
      role="dialog"
      aria-modal="true"
      className={className}
      aria-labelledby={p.heading ? `${id}-heading` : undefined}
      aria-describedby={`${id}-description`}
    >
      <div className="usa-modal__content">
        <div className="usa-modal__main">
          {p.heading && (
            <h2 className="usa-modal__heading" id={`${id}-heading`}>
              {p.heading}
            </h2>
          )}
          <div className="usa-prose" id={`${id}-description`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Pagination ────────────────────────────────────────────────────────────────
type PaginationAdapterProps = Partial<UswdsProps["Pagination"]> & Envelope<UswdsProps["Pagination"]>;

function Pagination(all: PaginationAdapterProps) {
  const { props: envelopeProps, emit: _emit, children: _children, ...rest } = all;
  const p = { ...rest, ...(envelopeProps ?? {}) };

  return (
    <TrussPagination
      pathname={p.pathname ?? "/"}
      currentPage={p.currentPage ?? 1}
      totalPages={p.totalPages ?? undefined}
      maxSlots={p.maxSlots ?? undefined}
    />
  );
}

// ── Tooltip ───────────────────────────────────────────────────────────────────
type TooltipAdapterProps = Partial<UswdsProps["Tooltip"]> & Envelope<UswdsProps["Tooltip"]>;

function Tooltip(all: TooltipAdapterProps) {
  const { props: envelopeProps, emit: _emit, children, ...rest } = all;
  const p = { ...rest, ...(envelopeProps ?? {}) };

  const trigger = children ?? <span>{p.label}</span>;

  return (
    <TrussTooltip
      label={p.label ?? ""}
      position={p.position ?? undefined}
      wrapperclasses={p.wrapperclasses ?? undefined}
    >
      {trigger}
    </TrussTooltip>
  );
}

// ── Grid ──────────────────────────────────────────────────────────────────────
type GridAdapterProps = Partial<UswdsProps["Grid"]> & Envelope<UswdsProps["Grid"]>;

function Grid(all: GridAdapterProps) {
  const { props: envelopeProps, emit: _emit, children, ...rest } = all;
  const p = { ...rest, ...(envelopeProps ?? {}) };

  return (
    <TrussGrid
      row={p.row ?? undefined}
      col={p.col ?? undefined}
      gap={p.gap ?? undefined}
    >
      {children}
    </TrussGrid>
  );
}

// ── GridContainer ─────────────────────────────────────────────────────────────
type GridContainerAdapterProps = Partial<UswdsProps["GridContainer"]> & Envelope<UswdsProps["GridContainer"]>;

function GridContainer(all: GridContainerAdapterProps) {
  const { props: envelopeProps, emit: _emit, children, ...rest } = all;
  const p = { ...rest, ...(envelopeProps ?? {}) };

  return (
    <TrussGridContainer>
      {children}
    </TrussGridContainer>
  );
}

// ── Icon ──────────────────────────────────────────────────────────────────────
type IconAdapterProps = Partial<UswdsProps["Icon"]> & Envelope<UswdsProps["Icon"]>;

function Icon(all: IconAdapterProps) {
  const { props: envelopeProps, emit: _emit, children: _children, ...rest } = all;
  const p = { ...rest, ...(envelopeProps ?? {}) };

  const IconComponent = (TrussIcon as unknown as Record<string, React.ComponentType<{ size?: number; className?: string }>>)[p.name ?? ""];
  if (!IconComponent) return <span className={p.className ?? undefined}>?</span>;

  return <IconComponent size={p.size ?? undefined} className={p.className ?? undefined} />;
}

// ── SiteAlert ─────────────────────────────────────────────────────────────────
type SiteAlertAdapterProps = Partial<UswdsProps["SiteAlert"]> & Envelope<UswdsProps["SiteAlert"]>;

function SiteAlert(all: SiteAlertAdapterProps) {
  const { props: envelopeProps, emit: _emit, children, ...rest } = all;
  const p = { ...rest, ...(envelopeProps ?? {}) };

  return (
    <TrussSiteAlert
      variant={p.variant ?? "info"}
      heading={p.heading ?? undefined}
      slim={p.slim ?? undefined}
      showIcon={p.showIcon ?? undefined}
    >
      {children}
    </TrussSiteAlert>
  );
}

// ── Breadcrumb ────────────────────────────────────────────────────────────────
type BreadcrumbItem = { label: string; href?: string | null; current?: boolean | null };
type BreadcrumbAdapterProps = Partial<UswdsProps["Breadcrumb"]> & Envelope<UswdsProps["Breadcrumb"]>;

function Breadcrumb(all: BreadcrumbAdapterProps) {
  const { props: envelopeProps, emit: _emit, children: _children, ...rest } = all;
  const p = { ...rest, ...(envelopeProps ?? {}) };

  const crumbs = (p.crumbs ?? []) as BreadcrumbItem[];

  return (
    <TrussBreadcrumbBar variant={p.variant ?? undefined}>
      {crumbs.map((crumb, i) => {
        const isCurrent = crumb.current ?? i === crumbs.length - 1;
        return (
          <TrussBreadcrumb key={crumb.label} current={isCurrent}>
            {isCurrent ? crumb.label : <a href={crumb.href ?? "#"} className="usa-breadcrumb__link">{crumb.label}</a>}
          </TrussBreadcrumb>
        );
      })}
    </TrussBreadcrumbBar>
  );
}

// ── SideNav ───────────────────────────────────────────────────────────────────
type SideNavItem = { label: string; href: string; current?: boolean | null };
type SideNavAdapterProps = Partial<UswdsProps["SideNav"]> & Envelope<UswdsProps["SideNav"]>;

function SideNav(all: SideNavAdapterProps) {
  const { props: envelopeProps, emit: _emit, children: _children, ...rest } = all;
  const p = { ...rest, ...(envelopeProps ?? {}) };

  const items = (p.items ?? []) as SideNavItem[];
  const navItems = items.map((item) => (
    <a key={item.href} href={item.href} className={item.current ? "usa-current" : undefined}>
      {item.label}
    </a>
  ));

  return (
    <TrussSideNav
      items={navItems}
      isSubnav={p.isSubnav ?? undefined}
    />
  );
}

// ── InPageNavigation ──────────────────────────────────────────────────────────
// TrussInPageNavigation requires a `content: JSX.Element` prop and scans it for
// heading elements via ResizeObserver — incompatible with jsdom + our items API.
// Render USWDS in-page nav markup directly instead.
type InPageNavItem = { text: string; href: string };
type InPageNavigationAdapterProps = Partial<UswdsProps["InPageNavigation"]> & Envelope<UswdsProps["InPageNavigation"]>;

function InPageNavigation(all: InPageNavigationAdapterProps) {
  const { props: envelopeProps, emit: _emit, children: _children, ...rest } = all;
  const p = { ...rest, ...(envelopeProps ?? {}) };

  const items = (p.items ?? []) as InPageNavItem[];
  const headingTag = p.headingUswdsStyle ?? "h4";
  const title = p.title ?? "On this page";
  return (
    <nav aria-label={title} className="usa-in-page-nav">
      {React.createElement(headingTag, { className: "usa-in-page-nav__heading" }, title)}
      <ul className="usa-in-page-nav__list">
        {items.map((item) => (
          <li key={item.href} className="usa-in-page-nav__item">
            <a href={item.href} className="usa-in-page-nav__link">
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// ── StepIndicator ─────────────────────────────────────────────────────────────
type StepItem = { label: string; status?: "complete" | "current" | "incomplete" | null };
type StepIndicatorAdapterProps = Partial<UswdsProps["StepIndicator"]> & Envelope<UswdsProps["StepIndicator"]>;

function StepIndicator(all: StepIndicatorAdapterProps) {
  const { props: envelopeProps, emit: _emit, children: _children, ...rest } = all;
  const p = { ...rest, ...(envelopeProps ?? {}) };

  const steps = (p.steps ?? []) as StepItem[];

  return (
    <TrussStepIndicator
      headingLevel={p.headingLevel ?? "h4"}
      showLabels={p.showLabels ?? undefined}
      counters={p.counters ?? undefined}
      centered={p.centered ?? undefined}
    >
      {steps.map((step) => (
        <TrussStepIndicatorStep
          key={step.label}
          label={step.label}
          status={step.status ?? "incomplete"}
        />
      ))}
    </TrussStepIndicator>
  );
}

// ── ProcessList ───────────────────────────────────────────────────────────────
type ProcessListAdapterProps = Partial<UswdsProps["ProcessList"]> & Envelope<UswdsProps["ProcessList"]>;

function ProcessList(all: ProcessListAdapterProps) {
  const { props: envelopeProps, emit: _emit, children: _children, ...rest } = all;
  const p = { ...rest, ...(envelopeProps ?? {}) };

  const steps = (p.steps ?? []) as string[];

  return (
    <TrussProcessList>
      {steps.map((step) => (
        <TrussProcessListItem key={step}>{step}</TrussProcessListItem>
      ))}
    </TrussProcessList>
  );
}

// ── SummaryBox ────────────────────────────────────────────────────────────────
type SummaryBoxAdapterProps = Partial<UswdsProps["SummaryBox"]> & Envelope<UswdsProps["SummaryBox"]>;

function SummaryBox(all: SummaryBoxAdapterProps) {
  const { props: envelopeProps, emit: _emit, children, ...rest } = all;
  const p = { ...rest, ...(envelopeProps ?? {}) };

  const items = (p.items ?? []) as string[];

  return (
    <TrussSummaryBox>
      {p.heading && <TrussSummaryBoxHeading headingLevel="h3">{p.heading}</TrussSummaryBoxHeading>}
      {items.length > 0 && (
        <ul className="usa-list">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
      {children}
    </TrussSummaryBox>
  );
}

// ── Search ────────────────────────────────────────────────────────────────────
type SearchAdapterProps = Partial<UswdsProps["Search"]> & Envelope<UswdsProps["Search"]>;

function Search(all: SearchAdapterProps) {
  const { props: envelopeProps, emit, children: _children, ...rest } = all;
  const p = { ...rest, ...(envelopeProps ?? {}) };

  // onSubmit prop is an action-binding name (string) for emit system.
  // Standalone (plain React) callers cannot bind submit — use a wrapping form.
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (p.onSubmit && emit) emit(p.onSubmit);
  };

  return (
    <TrussSearch
      label={p.label ?? "Search"}
      size={p.size ?? undefined}
      inputId={p.inputId ?? "search-input"}
      onSubmit={handleSubmit}
    />
  );
}

// ── Collection ────────────────────────────────────────────────────────────────
type CollectionItemDef = {
  heading: string;
  href?: string | null;
  description?: string | null;
  meta?: string[] | null;
};

type CollectionAdapterProps = Partial<UswdsProps["Collection"]> & Envelope<UswdsProps["Collection"]>;

function Collection(all: CollectionAdapterProps) {
  const { props: envelopeProps, emit: _emit, children: _children, ...rest } = all;
  const p = { ...rest, ...(envelopeProps ?? {}) };

  const items = (p.items ?? []) as CollectionItemDef[];

  return (
    <TrussCollection>
      {items.map((item) => (
        <TrussCollectionItem key={item.heading}>
          <TrussCollectionHeading headingLevel="h3">
            {item.href ? <a href={item.href} className="usa-link">{item.heading}</a> : item.heading}
          </TrussCollectionHeading>
          {item.description && (
            <TrussCollectionDescription>{item.description}</TrussCollectionDescription>
          )}
          {item.meta && item.meta.length > 0 && (
            <TrussCollectionMeta>
              {item.meta.map((m, j) => (
                <TrussCollectionMetaItem key={j}>{m}</TrussCollectionMetaItem>
              ))}
            </TrussCollectionMeta>
          )}
        </TrussCollectionItem>
      ))}
    </TrussCollection>
  );
}

// ── Banner (GovBanner) ────────────────────────────────────────────────────────
// GovBanner's tld prop expects ".gov" | ".mil" (with leading dot) but our
// catalog exposes "gov" | "mil" for simplicity. We prepend the dot internally.
type BannerAdapterProps = Partial<UswdsProps["Banner"]> & Envelope<UswdsProps["Banner"]>;

function Banner(all: BannerAdapterProps) {
  const { props: envelopeProps, emit: _emit, children: _children, ...rest } = all;
  const p = { ...rest, ...(envelopeProps ?? {}) };

  const rawTld = p.tld ?? "gov";
  const tld = (rawTld.startsWith(".") ? rawTld : `.${rawTld}`) as ".gov" | ".mil";

  return (
    <TrussGovBanner
      language={(p.language ?? "english") as "english" | "spanish"}
      tld={tld}
    />
  );
}

// ── Identifier ────────────────────────────────────────────────────────────────
type IdentifierLinkDef = { label: string; href: string };
type IdentifierAdapterProps = Partial<UswdsProps["Identifier"]> & Envelope<UswdsProps["Identifier"]>;

function Identifier(all: IdentifierAdapterProps) {
  const { props: envelopeProps, emit: _emit, children: _children, ...rest } = all;
  const p = { ...rest, ...(envelopeProps ?? {}) };

  const identity = p.identity ?? { domain: "" };
  const links = (p.links ?? []) as IdentifierLinkDef[];

  return (
    <TrussIdentifier>
      <TrussIdentifierMasthead aria-label={identity.ariaLabel ?? undefined}>
        <TrussIdentifierLogos>
          <TrussIdentifierLogo href="#">
            {p.logoSrc ? (
              <img src={p.logoSrc} alt={p.logoAlt ?? ""} className="usa-identifier__logo-img" />
            ) : (
              <span className="usa-identifier__logo-img">{identity.domain}</span>
            )}
          </TrussIdentifierLogo>
        </TrussIdentifierLogos>
        <TrussIdentifierIdentity domain={identity.domain}>
          {identity.disclaimerText ?? undefined}
        </TrussIdentifierIdentity>
      </TrussIdentifierMasthead>
      {links.length > 0 && (
        <TrussIdentifierLinks>
          {links.map((link) => (
            <TrussIdentifierLinkItem key={link.href}>
              <TrussIdentifierLink href={link.href}>{link.label}</TrussIdentifierLink>
            </TrussIdentifierLinkItem>
          ))}
        </TrussIdentifierLinks>
      )}
      <TrussIdentifierGov />
    </TrussIdentifier>
  );
}

// ── Header ────────────────────────────────────────────────────────────────────
type HeaderNavItem = { label: string; href: string; current?: boolean | null };
type HeaderAdapterProps = Partial<UswdsProps["Header"]> & Envelope<UswdsProps["Header"]>;

function Header(all: HeaderAdapterProps) {
  const { props: envelopeProps, emit: _emit, children: _children, ...rest } = all;
  const p = { ...rest, ...(envelopeProps ?? {}) };

  const navItems = (p.navItems ?? []) as HeaderNavItem[];
  const [mobileExpanded, setMobileExpanded] = React.useState(false);

  const navLinks = navItems.map((item) => (
    <a
      key={item.href}
      href={item.href}
      className={item.current ? "usa-current" : undefined}
    >
      {item.label}
    </a>
  ));

  return (
    <TrussHeader
      basic={p.basic !== false}
    >
      <div className="usa-nav-container">
        <div className="usa-navbar">
          <TrussTitle>
            <a href="/">{p.title ?? ""}</a>
          </TrussTitle>
          {navItems.length > 0 && (
            <TrussNavMenuButton
              label="Menu"
              onClick={() => setMobileExpanded((v) => !v)}
            />
          )}
        </div>
        {navItems.length > 0 && (
          <TrussPrimaryNav
            items={navLinks}
            mobileExpanded={mobileExpanded}
            onToggleMobileNav={() => setMobileExpanded((v) => !v)}
          />
        )}
      </div>
    </TrussHeader>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
type FooterColumn = { heading: string; links: Array<{ label: string; href: string }> };
type FooterAdapterProps = Partial<UswdsProps["Footer"]> & Envelope<UswdsProps["Footer"]>;

function Footer(all: FooterAdapterProps) {
  const { props: envelopeProps, emit: _emit, children: _children, ...rest } = all;
  const p = { ...rest, ...(envelopeProps ?? {}) };

  const size = p.size ?? "slim";
  const columns = (p.columns ?? []) as FooterColumn[];

  // col.heading is not rendered — USWDS slim footer layout does not
  // support per-column headings in this adapter's simplified structure.
  const navLinks = columns.flatMap((col) =>
    col.links.map((link) => (
      <a key={link.href} href={link.href} className="usa-footer__primary-link">
        {link.label}
      </a>
    ))
  );

  // FooterNav crashes when links array is empty — render nav markup directly in that case
  const primaryContent =
    navLinks.length > 0 ? (
      <TrussFooterNav size={size} links={navLinks} />
    ) : (
      <nav className="usa-footer__nav" aria-label="Footer navigation" />
    );

  const logoImage = p.logoSrc ? (
    <img src={p.logoSrc} alt={p.logoAlt ?? ""} />
  ) : (
    <span />
  );

  const secondaryContent = (
    <TrussLogo size={size} image={logoImage} />
  );

  return (
    <TrussFooter
      size={size}
      primary={primaryContent}
      secondary={secondaryContent}
    />
  );
}

// ── LanguageSelector ──────────────────────────────────────────────────────────
type LangDef = { label: string; lang: string; href?: string | null };
type LanguageSelectorAdapterProps = Partial<UswdsProps["LanguageSelector"]> & Envelope<UswdsProps["LanguageSelector"]>;

function LanguageSelector(all: LanguageSelectorAdapterProps) {
  const { props: envelopeProps, emit: _emit, children: _children, ...rest } = all;
  const p = { ...rest, ...(envelopeProps ?? {}) };

  const langs = (p.langs ?? []) as LangDef[];

  // LanguageDefinition: { label, label_local?, attr, on_click }
  const languageDefinitions = langs.map((l) => ({
    label: l.label,
    attr: l.lang,
    // on_click: string path for navigation-based language selection.
    // When href is omitted, "#" is used — callers should provide href for each lang.
    on_click: l.href ?? "#",
  }));

  return (
    <TrussLanguageSelector
      langs={languageDefinitions}
      small={p.small ?? undefined}
    />
  );
}

// ── IconList ──────────────────────────────────────────────────────────────────
type IconListItemDef = { iconName: string; text: string; iconColor?: string | null };
type IconListAdapterProps = Partial<UswdsProps["IconList"]> & Envelope<UswdsProps["IconList"]>;

function IconList(all: IconListAdapterProps) {
  const { props: envelopeProps, emit: _emit, children: _children, ...rest } = all;
  const p = { ...rest, ...(envelopeProps ?? {}) };

  const items = (p.items ?? []) as IconListItemDef[];

  return (
    <TrussIconList>
      {items.map((item) => {
        const IconComponent = (TrussIcon as unknown as Record<string, React.ComponentType<{ className?: string }>>)[item.iconName];
        return (
          <TrussIconListItem key={`${item.iconName}-${item.text}`}>
            <TrussIconListIcon className={item.iconColor ?? undefined}>
              {IconComponent ? (
                <IconComponent />
              ) : (
                <span aria-hidden="true">•</span>
              )}
            </TrussIconListIcon>
            <TrussIconListContent>{item.text}</TrussIconListContent>
          </TrussIconListItem>
        );
      })}
    </TrussIconList>
  );
}

// ── MediaBlock ────────────────────────────────────────────────────────────────
// Truss exports MediaBlockBody but not a composite MediaBlock. We render
// USWDS media block markup directly using the usa-media-block CSS classes.
type MediaBlockAdapterProps = Partial<UswdsProps["MediaBlock"]> & Envelope<UswdsProps["MediaBlock"]>;

function MediaBlock(all: MediaBlockAdapterProps) {
  const { props: envelopeProps, emit: _emit, children: _children, ...rest } = all;
  const p = { ...rest, ...(envelopeProps ?? {}) };

  const containerClass = ["usa-media-block", p.reversed ? "usa-media-block--reversed" : ""]
    .filter(Boolean)
    .join(" ");

  const img = (
    <img
      className="usa-media-block__img"
      src={p.imgSrc ?? ""}
      alt={p.imgAlt ?? ""}
    />
  );

  return (
    <div className={containerClass}>
      {!p.reversed && img}
      <TrussMediaBlockBody className="usa-media-block__body">
        {p.heading && <h2 className="usa-media-block__heading">{p.heading}</h2>}
        {p.body && <p className="font-sans-md">{p.body}</p>}
      </TrussMediaBlockBody>
      {p.reversed && img}
    </div>
  );
}

// ── ComboBox ──────────────────────────────────────────────────────────────────
type ComboBoxAdapterProps = Partial<UswdsProps["ComboBox"]> & Envelope<UswdsProps["ComboBox"]>;

function ComboBox(all: ComboBoxAdapterProps) {
  const { props: envelopeProps, emit, children: _children, ...rest } = all;
  const p = { ...rest, ...(envelopeProps ?? {}) };

  const handleChange = (_val?: string) => {
    if (p.onChange && emit) emit(p.onChange);
  };

  return (
    <TrussComboBox
      id={p.id!}
      name={p.name!}
      options={p.options ?? []}
      onChange={handleChange}
      defaultValue={p.defaultValue ?? undefined}
      disabled={p.disabled ?? undefined}
      assistiveHint={p.assistiveHint ?? undefined}
      noResults={p.noResults ?? undefined}
    />
  );
}

// ── DatePicker ────────────────────────────────────────────────────────────────
type DatePickerAdapterProps = Partial<UswdsProps["DatePicker"]> & Envelope<UswdsProps["DatePicker"]>;

function DatePicker(all: DatePickerAdapterProps) {
  const { props: envelopeProps, emit: _emit, children: _children, ...rest } = all;
  const p = { ...rest, ...(envelopeProps ?? {}) };

  return (
    <div>
      {p.label && <TrussLabel htmlFor={p.id!}>{p.label}</TrussLabel>}
      <TrussDatePicker
        id={p.id!}
        name={p.name!}
        defaultValue={p.defaultValue ?? undefined}
        minDate={p.minDate ?? undefined}
        maxDate={p.maxDate ?? undefined}
        disabled={p.disabled ?? undefined}
        required={p.required ?? undefined}
        validationStatus={p.validationStatus ?? undefined}
      />
    </div>
  );
}

// ── DateRangePicker ───────────────────────────────────────────────────────────
type DateRangePickerAdapterProps = Partial<UswdsProps["DateRangePicker"]> & Envelope<UswdsProps["DateRangePicker"]>;

function DateRangePicker(all: DateRangePickerAdapterProps) {
  const { props: envelopeProps, emit: _emit, children: _children, ...rest } = all;
  const p = { ...rest, ...(envelopeProps ?? {}) };

  return (
    <TrussDateRangePicker
      startDatePickerProps={{ id: p.startDateId!, name: p.startDateName!, minDate: p.minDate ?? undefined, maxDate: p.maxDate ?? undefined }}
      endDatePickerProps={{ id: p.endDateId!, name: p.endDateName!, minDate: p.minDate ?? undefined, maxDate: p.maxDate ?? undefined }}
      startDateLabel={p.startDateLabel ?? undefined}
      endDateLabel={p.endDateLabel ?? undefined}
    />
  );
}

// ── FileInput ─────────────────────────────────────────────────────────────────
type FileInputAdapterProps = Partial<UswdsProps["FileInput"]> & Envelope<UswdsProps["FileInput"]>;

function FileInput(all: FileInputAdapterProps) {
  const { props: envelopeProps, emit: _emit, children: _children, ...rest } = all;
  const p = { ...rest, ...(envelopeProps ?? {}) };

  return (
    <div>
      {p.label && <TrussLabel htmlFor={p.id!}>{p.label}</TrussLabel>}
      <TrussFileInput
        id={p.id!}
        name={p.name!}
        multiple={p.multiple ?? undefined}
        accept={p.accept ?? undefined}
        disabled={p.disabled ?? undefined}
        dragText={p.dragText ?? undefined}
        chooseText={p.chooseText ?? undefined}
      />
    </div>
  );
}

// ── RangeInput ────────────────────────────────────────────────────────────────
type RangeInputAdapterProps = Partial<UswdsProps["RangeInput"]> & Envelope<UswdsProps["RangeInput"]>;

function RangeInput(all: RangeInputAdapterProps) {
  const { props: envelopeProps, emit: _emit, children: _children, ...rest } = all;
  const p = { ...rest, ...(envelopeProps ?? {}) };

  return (
    <div>
      {p.label && <TrussLabel htmlFor={p.id!}>{p.label}</TrussLabel>}
      <TrussRangeInput
        id={p.id!}
        name={p.name!}
        min={p.min ?? undefined}
        max={p.max ?? undefined}
        step={p.step ?? undefined}
        defaultValue={p.defaultValue ?? undefined}
        disabled={p.disabled ?? undefined}
      />
    </div>
  );
}

// ── TimePicker ────────────────────────────────────────────────────────────────
type TimePickerAdapterProps = Partial<UswdsProps["TimePicker"]> & Envelope<UswdsProps["TimePicker"]>;

function TimePicker(all: TimePickerAdapterProps) {
  const { props: envelopeProps, emit: _emit, children: _children, ...rest } = all;
  const p = { ...rest, ...(envelopeProps ?? {}) };

  return (
    <div>
      {p.label && <TrussLabel htmlFor={p.id!}>{p.label}</TrussLabel>}
      <TrussTimePicker
        id={p.id!}
        name={p.name!}
        defaultValue={p.defaultValue ?? undefined}
        minTime={p.minTime ?? undefined}
        maxTime={p.maxTime ?? undefined}
        step={p.step ?? undefined}
        disabled={p.disabled ?? undefined}
      />
    </div>
  );
}

// ── FormGroup ─────────────────────────────────────────────────────────────────
type FormGroupAdapterProps = Partial<UswdsProps["FormGroup"]> & Envelope<UswdsProps["FormGroup"]>;

function FormGroup(all: FormGroupAdapterProps) {
  const { props: envelopeProps, emit: _emit, children, ...rest } = all;
  const p = { ...rest, ...(envelopeProps ?? {}) };

  return (
    <TrussFormGroup error={p.error ?? undefined}>
      {children}
    </TrussFormGroup>
  );
}

// ── Label ─────────────────────────────────────────────────────────────────────
type LabelAdapterProps = Partial<UswdsProps["Label"]> & Envelope<UswdsProps["Label"]>;

function Label(all: LabelAdapterProps) {
  const { props: envelopeProps, emit: _emit, children, ...rest } = all;
  const p = { ...rest, ...(envelopeProps ?? {}) };

  return (
    <TrussLabel
      htmlFor={p.htmlFor!}
      hint={p.hint ?? undefined}
      error={p.error ?? undefined}
    >
      {p.text ?? children}
    </TrussLabel>
  );
}

// ── ErrorMessage ──────────────────────────────────────────────────────────────
type ErrorMessageAdapterProps = Partial<UswdsProps["ErrorMessage"]> & Envelope<UswdsProps["ErrorMessage"]>;

function ErrorMessage(all: ErrorMessageAdapterProps) {
  const { props: envelopeProps, emit: _emit, children, ...rest } = all;
  const p = { ...rest, ...(envelopeProps ?? {}) };

  return (
    <TrussErrorMessage id={p.id ?? undefined}>
      {p.text ?? children}
    </TrussErrorMessage>
  );
}

// ── CharacterCount ────────────────────────────────────────────────────────────
type CharacterCountAdapterProps = Partial<UswdsProps["CharacterCount"]> & Envelope<UswdsProps["CharacterCount"]>;

function CharacterCount(all: CharacterCountAdapterProps) {
  const { props: envelopeProps, emit: _emit, children: _children, ...rest } = all;
  const p = { ...rest, ...(envelopeProps ?? {}) };

  return (
    <TrussCharacterCount
      id={p.id!}
      name={p.name!}
      maxLength={p.maxLength!}
      isTextArea={p.isTextArea ?? undefined}
      defaultValue={p.defaultValue ?? undefined}
      label={p.label ?? undefined}
    />
  );
}

// ── TextInputMask ─────────────────────────────────────────────────────────────
type TextInputMaskAdapterProps = Partial<UswdsProps["TextInputMask"]> & Envelope<UswdsProps["TextInputMask"]>;

function TextInputMask(all: TextInputMaskAdapterProps) {
  const { props: envelopeProps, emit: _emit, children: _children, ...rest } = all;
  const p = { ...rest, ...(envelopeProps ?? {}) };

  return (
    <TrussTextInputMask
      id={p.id!}
      name={p.name!}
      mask={p.mask!}
      label={p.label!}
      type={p.type ?? undefined}
      defaultValue={p.defaultValue ?? undefined}
      disabled={p.disabled ?? undefined}
    />
  );
}

// ── Registry ──────────────────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const uswdsComponents: Record<string, React.ComponentType<any>> = {
  Button,
  ButtonGroup,
  Alert,
  Badge,
  Link,
  Card,
  Heading,
  Text,
  Accordion,
  Table,
  Input,
  Textarea,
  Select,
  Checkbox,
  Radio,
  Modal,
  Pagination,
  Tooltip,
  Grid,
  GridContainer,
  Icon,
  SiteAlert,
  Breadcrumb,
  SideNav,
  InPageNavigation,
  StepIndicator,
  ProcessList,
  SummaryBox,
  Search,
  Collection,
  Banner,
  Identifier,
  Header,
  Footer,
  LanguageSelector,
  IconList,
  MediaBlock,
  ComboBox,
  DatePicker,
  DateRangePicker,
  FileInput,
  RangeInput,
  TimePicker,
  FormGroup,
  Label,
  ErrorMessage,
  CharacterCount,
  TextInputMask,
  Section,
};

export type { UswdsProps };
