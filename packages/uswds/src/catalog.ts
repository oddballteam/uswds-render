import { z } from "zod";

export type ComponentDefinition = {
  props: z.ZodTypeAny;
  slots?: string[];
  description: string;
  example: unknown;
};

export const uswdsComponentDefinitions = {
  Button: {
    props: z.object({
      type: z.enum(["button", "submit", "reset"]).nullish(),
      variant: z.enum(["default", "secondary", "base", "accent-cool", "accent-warm", "outline", "unstyled"]).nullish(),
      size: z.enum(["default", "big"]).nullish(),
      disabled: z.boolean().nullish(),
      onClick: z.string().nullish().describe("Action binding name"),
      className: z.string().nullish(),
    }),
    slots: ["default"],
    description: "USWDS button (usa-button). variant=default is filled blue primary; secondary/outline/etc map to Truss bool props. Pass label text as children.",
    example: { type: "button", variant: "default" },
  },

  ButtonGroup: {
    props: z.object({
      type: z.enum(["default", "segmented"]).nullish(),
      className: z.string().nullish(),
    }),
    slots: ["default"],
    description: "Group of related USWDS buttons (usa-button-group). Children should be Button elements.",
    example: { type: "default" },
  },

  Alert: {
    props: z.object({
      type: z.enum(["success", "warning", "error", "info"]).nullish().describe("Alert severity."),
      variant: z.enum(["success", "warning", "error", "info", "emergency"]).nullish().describe("Alias for type."),
      heading: z.string().nullish(),
      headingLevel: z.enum(["h1", "h2", "h3", "h4", "h5", "h6"]).nullish().describe("Required by Truss Alert. Defaults to h4."),
      slim: z.boolean().nullish(),
      noIcon: z.boolean().nullish(),
      className: z.string().nullish(),
    }),
    slots: ["default"],
    description: "USWDS alert (usa-alert). Required: type (or variant alias). headingLevel defaults to h4. Children = body text.",
    example: { type: "info", heading: "Heads up", headingLevel: "h4" },
  },

  Badge: {
    props: z.object({
      text: z.string().nullish().describe("Tag label. Pass via text prop."),
      background: z.string().nullish().describe("Optional CSS color for tag background."),
      className: z.string().nullish(),
    }),
    slots: ["default"],
    description: "USWDS tag (usa-tag). Small inline label for statuses. Pass content via the 'text' prop.",
    example: { text: "Active" },
  },

  Link: {
    props: z.object({
      label: z.string().nullish().describe("Visible link text."),
      href: z.string().describe("Navigation target. Required."),
      variant: z.enum(["external", "unstyled", "nav"]).nullish(),
      className: z.string().nullish(),
    }),
    slots: ["default"],
    description: "USWDS anchor link (usa-link). Pass visible text via the 'label' prop.",
    example: { label: "Learn more", href: "/about" },
  },

  Card: {
    props: z.object({
      layout: z.enum(["standardDefault", "flagDefault", "flagMediaRight"]).nullish(),
      headerFirst: z.boolean().nullish(),
      className: z.string().nullish(),
    }),
    slots: ["default"],
    description:
      "USWDS card (usa-card). Children are wrapped in CardBody automatically. Use layout='flagDefault' for horizontal media cards.",
    example: { layout: "standardDefault" },
  },

  Heading: {
    props: z.object({
      level: z.enum(["h1", "h2", "h3", "h4", "h5", "h6"]).nullish(),
      text: z.string().nullish().describe("Heading text. Pass via text prop, not children."),
      className: z.string().nullish(),
    }),
    slots: ["default"],
    description:
      "USWDS-styled heading (h1–h6). Pass content via the 'text' prop. Defaults to h2. Applies usa-prose class.",
    example: { level: "h2", text: "Section title" },
  },

  Text: {
    props: z.object({
      as: z.enum(["p", "span", "div"]).nullish(),
      size: z.enum(["xs", "sm", "base", "lg", "xl"]).nullish(),
      text: z.string().nullish().describe("Text content. Pass via text prop, not children."),
      className: z.string().nullish(),
    }),
    slots: ["default"],
    description:
      "USWDS-styled text block. Pass content via the 'text' prop. Defaults to <p>. Use size for USWDS font-sans-* utility sizes.",
    example: { as: "p", size: "base", text: "Body copy goes here." },
  },

  Accordion: {
    props: z.object({
      bordered: z.boolean().nullish(),
      multiselectable: z.boolean().nullish(),
      items: z.array(
        z.object({
          id: z.string(),
          title: z.string(),
          content: z.string(),
          expanded: z.boolean(),
          headingLevel: z.enum(["h2", "h3", "h4", "h5", "h6"]).nullish(),
          className: z.string().nullish(),
        })
      ).describe("Accordion item definitions."),
      className: z.string().nullish(),
    }),
    description:
      "USWDS accordion (usa-accordion). Pass all sections via the items array — no children. Each item needs id, title, content, expanded.",
    example: {
      items: [
        {
          id: "acc-1",
          title: "First section",
          content: "First section body.",
          expanded: false,
          headingLevel: "h4",
        },
      ],
    },
  },

  Table: {
    props: z.object({
      bordered: z.boolean().nullish(),
      caption: z.string().nullish(),
      fullWidth: z.boolean().nullish(),
      fixed: z.boolean().nullish(),
      scrollable: z.boolean().nullish(),
      striped: z.boolean().nullish(),
      compact: z.boolean().nullish(),
      stackedStyle: z.enum(["none", "default", "headers"]).nullish(),
      stickyHeader: z.boolean().nullish(),
      className: z.string().nullish(),
    }),
    slots: ["default"],
    description:
      "USWDS table (usa-table). Pass thead/tbody/tr/th/td as children. Use caption prop for an accessible caption. Truss has no columns/rows API — children only.",
    example: { caption: "Sample data", striped: true },
  },

  Input: {
    props: z.object({
      id: z.string().describe("Required. Unique field id."),
      name: z.string().describe("Required. Form field name."),
      type: z.enum(["text", "email", "number", "password", "search", "tel", "url"]).nullish(),
      label: z.string().nullish().describe("Visible label above the input."),
      hint: z.string().nullish().describe("Helper text rendered below the label."),
      validationStatus: z.enum(["error", "success"]).nullish(),
      inputSize: z.enum(["small", "medium"]).nullish(),
      placeholder: z.string().nullish(),
      defaultValue: z.string().nullish(),
      disabled: z.boolean().nullish(),
      required: z.boolean().nullish(),
      className: z.string().nullish(),
    }),
    description:
      "USWDS text input (usa-input). Provide id and name. Add label for an accessible label. Add hint for helper text. validationStatus='error' shows the error state.",
    example: { id: "first-name", name: "firstName", type: "text", label: "First name" },
  },

  Textarea: {
    props: z.object({
      id: z.string().describe("Required. Unique field id."),
      name: z.string().describe("Required. Form field name."),
      label: z.string().nullish().describe("Visible label above the textarea."),
      hint: z.string().nullish(),
      placeholder: z.string().nullish(),
      rows: z.number().nullish(),
      defaultValue: z.string().nullish(),
      disabled: z.boolean().nullish(),
      required: z.boolean().nullish(),
      error: z.boolean().nullish(),
      className: z.string().nullish(),
    }),
    description:
      "USWDS textarea (usa-textarea). Provide id and name. Add label for an accessible label. Use rows to control height.",
    example: { id: "comments", name: "comments", label: "Comments", rows: 4 },
  },

  Select: {
    props: z.object({
      id: z.string().describe("Required. Unique field id."),
      name: z.string().describe("Required. Form field name."),
      label: z.string().nullish(),
      options: z.array(z.object({ value: z.string(), label: z.string() }))
        .nullish()
        .describe("Select options list."),
      validationStatus: z.enum(["error", "success"]).nullish(),
      defaultValue: z.string().nullish(),
      disabled: z.boolean().nullish(),
      required: z.boolean().nullish(),
      className: z.string().nullish(),
    }),
    description:
      "USWDS select dropdown (usa-select). Pass options as [{value, label}] array. Add label for an accessible label.",
    example: {
      id: "state",
      name: "state",
      label: "State",
      options: [
        { value: "va", label: "Virginia" },
        { value: "md", label: "Maryland" },
      ],
    },
  },

  Checkbox: {
    props: z.object({
      id: z.string().describe("Required. Unique input id."),
      name: z.string().describe("Required. Form field name."),
      label: z.string().describe("Required. Visible label text."),
      tile: z.boolean().nullish(),
      labelDescription: z.string().nullish(),
      defaultChecked: z.boolean().nullish(),
      disabled: z.boolean().nullish(),
      className: z.string().nullish(),
    }),
    description:
      "USWDS checkbox (usa-checkbox). label prop is required — it is the visible text. Use tile=true for the tile variant.",
    example: { id: "subscribe", name: "subscribe", label: "Subscribe to updates" },
  },

  Radio: {
    props: z.object({
      id: z.string().describe("Required. Must be unique across all radios."),
      name: z.string().describe("Required. All radios in a group share the same name."),
      label: z.string().describe("Required. Visible label text."),
      tile: z.boolean().nullish(),
      labelDescription: z.string().nullish(),
      defaultChecked: z.boolean().nullish(),
      disabled: z.boolean().nullish(),
      className: z.string().nullish(),
    }),
    description:
      "USWDS radio button (usa-radio). Single button — render multiple Radio elements sharing the same name for a radio group.",
    example: { id: "opt-yes", name: "confirm", label: "Yes" },
  },

  Modal: {
    props: z.object({
      id: z.string().describe("Required. Unique modal id."),
      open: z.boolean().nullish().describe("Whether the modal is shown. Defaults to false."),
      heading: z.string().nullish().describe("Modal heading text, rendered inside ModalHeading."),
      isLarge: z.boolean().nullish(),
      forceAction: z.boolean().nullish(),
      className: z.string().nullish(),
    }),
    slots: ["default"],
    description:
      "USWDS modal dialog (usa-modal). Set open=true to show. Pass heading prop for the modal title. Children = modal body.",
    example: { id: "confirm-modal", open: true, heading: "Confirm action" },
  },

  Pagination: {
    props: z.object({
      pathname: z.string().describe("Required. Base path for page links."),
      currentPage: z.number().describe("Required. Current page number (1-indexed)."),
      totalPages: z.number().nullish(),
      maxSlots: z.number().nullish(),
      className: z.string().nullish(),
    }),
    description:
      "USWDS pagination (usa-pagination). Provide pathname and currentPage. totalPages controls how many pages render.",
    example: { pathname: "/results", currentPage: 3, totalPages: 10 },
  },

  Tooltip: {
    props: z.object({
      label: z.string().describe("Required. Tooltip text shown on hover."),
      position: z.enum(["top", "bottom", "left", "right"]).nullish(),
      wrapperclasses: z.string().nullish(),
      className: z.string().nullish(),
    }),
    slots: ["default"],
    description:
      "USWDS tooltip (usa-tooltip). Pass label for tooltip text. Children = the trigger element. Position defaults to top.",
    example: { label: "More information", position: "top" },
  },

  Grid: {
    props: z.object({
      row: z.boolean().nullish(),
      col: z.union([z.number(), z.string()]).nullish(),
      gap: z.union([z.number(), z.string()]).nullish(),
      className: z.string().nullish(),
    }),
    slots: ["default"],
    description:
      "USWDS grid cell or row (grid-col / grid-row). Use col to set column span. Use row for a flex row. Nest inside GridContainer.",
    example: { col: 6 },
  },

  GridContainer: {
    props: z.object({
      className: z.string().nullish(),
    }),
    slots: ["default"],
    description:
      "USWDS grid container (grid-container). Outer wrapper for Grid layout. Contains Grid row/col children.",
    example: {},
  },

  Icon: {
    props: z.object({
      name: z.string().describe("Icon name from Truss Icon namespace, e.g. 'Search', 'Star', 'AccountBalance'"),
      size: z.union([z.literal(3), z.literal(4), z.literal(5), z.literal(6), z.literal(7), z.literal(8), z.literal(9)]).nullish(),
      className: z.string().nullish(),
    }),
    description: "Renders a USWDS icon from the @trussworks/react-uswds Icon namespace.",
    example: { name: "Star", size: 4 },
  },

  SiteAlert: {
    props: z.object({
      variant: z.enum(["info", "emergency"]).describe("Alert variant: 'info' (blue) or 'emergency' (red)"),
      heading: z.string().nullish(),
      slim: z.boolean().nullish(),
      showIcon: z.boolean().nullish(),
      className: z.string().nullish(),
    }),
    slots: ["default"],
    description: "Full-width site-level alert banner (USWDS SiteAlert). Pass body text as children.",
    example: { variant: "info", heading: "COVID-19 information" },
  },

  Breadcrumb: {
    props: z.object({
      crumbs: z.array(
        z.object({
          label: z.string(),
          href: z.string().nullish(),
          current: z.boolean().nullish(),
        })
      ).describe("Ordered list of breadcrumb items. Last item is current page."),
      variant: z.enum(["default", "wrap"]).nullish(),
      className: z.string().nullish(),
    }),
    description: "USWDS breadcrumb navigation bar.",
    example: {
      crumbs: [
        { label: "Home", href: "/" },
        { label: "Benefits", href: "/benefits" },
        { label: "Health care", current: true },
      ],
    },
  },

  SideNav: {
    props: z.object({
      items: z.array(
        z.object({
          label: z.string(),
          href: z.string(),
          current: z.boolean().nullish(),
        })
      ).describe("Navigation items rendered as anchor tags"),
      isSubnav: z.boolean().nullish(),
      className: z.string().nullish(),
    }),
    description: "USWDS side navigation menu.",
    example: {
      items: [
        { label: "Overview", href: "#overview" },
        { label: "Details", href: "#details", current: true },
        { label: "Documents", href: "#documents" },
      ],
    },
  },

  InPageNavigation: {
    props: z.object({
      title: z.string().describe("Heading text for the nav section, e.g. 'On this page'"),
      items: z.array(
        z.object({
          text: z.string(),
          href: z.string(),
        })
      ),
      headingUswdsStyle: z.enum(["h1", "h2", "h3", "h4", "h5", "h6"]).nullish(),
      className: z.string().nullish(),
    }),
    description: "USWDS in-page navigation (table of contents) component.",
    example: {
      title: "On this page",
      headingUswdsStyle: "h4",
      items: [
        { text: "Eligibility", href: "#eligibility" },
        { text: "How to apply", href: "#apply" },
        { text: "After you apply", href: "#after" },
      ],
    },
  },

  StepIndicator: {
    props: z.object({
      steps: z.array(
        z.object({
          label: z.string(),
          status: z.enum(["complete", "current", "incomplete"]).nullish(),
        })
      ).describe("Ordered list of steps"),
      headingLevel: z.enum(["h1", "h2", "h3", "h4", "h5", "h6"]).nullish(),
      showLabels: z.boolean().nullish(),
      counters: z.enum(["none", "default", "small"]).nullish(),
      centered: z.boolean().nullish(),
      className: z.string().nullish(),
    }),
    description: "USWDS step indicator showing progress through a multi-step process.",
    example: {
      headingLevel: "h4",
      showLabels: true,
      steps: [
        { label: "Personal info", status: "complete" },
        { label: "Household members", status: "current" },
        { label: "Review", status: "incomplete" },
      ],
    },
  },

  ProcessList: {
    props: z.object({
      steps: z.array(z.string()).describe("Ordered list of step description strings"),
      className: z.string().nullish(),
    }),
    description: "USWDS process list — numbered sequential steps.",
    example: {
      steps: [
        "Submit your application online.",
        "Wait for confirmation email within 3 business days.",
        "Schedule your in-person appointment.",
      ],
    },
  },

  SummaryBox: {
    props: z.object({
      heading: z.string().nullish(),
      items: z.array(z.string()).nullish(),
      className: z.string().nullish(),
    }),
    slots: ["default"],
    description: "USWDS summary box — highlighted box for key information.",
    example: {
      heading: "Key information",
      items: [
        "Applications are accepted year-round.",
        "Processing takes 4–6 weeks.",
        "You will be notified by mail.",
      ],
    },
  },

  Search: {
    props: z.object({
      label: z.string().nullish().describe("Accessible label for search input (default 'Search')"),
      size: z.enum(["big", "small"]).nullish(),
      inputId: z.string().nullish(),
      onSubmit: z.string().nullish().describe("Action binding name called with query on submit"),
      className: z.string().nullish(),
    }),
    description: "USWDS search bar component.",
    example: { label: "Search", size: "small" },
  },

  Collection: {
    props: z.object({
      items: z.array(
        z.object({
          heading: z.string().describe("Title of the collection item"),
          href: z.string().nullish(),
          description: z.string().nullish(),
          meta: z.array(z.string()).nullish().describe("Short metadata strings shown below description"),
        })
      ).describe("Collection items"),
      className: z.string().nullish(),
    }),
    description: "USWDS collection — a list of items each with a heading, optional description, and metadata. Use with caution — limited AI support for rich media variants.",
    example: {
      items: [
        { heading: "Benefit update", href: "#", description: "New rates effective January 1.", meta: ["Jan 1, 2026", "Benefits"] },
        { heading: "System maintenance", href: "#", description: "Scheduled downtime this weekend." },
      ],
    },
  },

  Banner: {
    props: z.object({
      language: z.enum(["english", "spanish"]).nullish().describe("Language variant (default 'english')"),
      tld: z.enum(["gov", "mil"]).nullish().describe("Domain TLD shown in the banner (default 'gov')"),
      className: z.string().nullish(),
    }),
    description: "USWDS GovBanner — the 'An official website of the United States government' top-of-page banner. Use with caution — place at top of page layout only.",
    example: { language: "english", tld: "gov" },
  },

  Identifier: {
    props: z.object({
      identity: z.object({
        ariaLabel: z.string().nullish(),
        domain: z.string().describe("Agency domain, e.g. 'agency.gov'"),
        disclaimerText: z.string().nullish(),
      }).describe("Agency identity information"),
      logoSrc: z.string().nullish(),
      logoAlt: z.string().nullish(),
      links: z.array(
        z.object({ label: z.string(), href: z.string() })
      ).nullish().describe("Footer identifier links (About, Accessibility, etc.)"),
      className: z.string().nullish(),
    }),
    description: "USWDS Identifier — agency identity footer block with logo, domain, and standard gov links. Use with caution — limited AI support.",
    example: {
      identity: { domain: "agency.gov", disclaimerText: "An official website of the Department of Example Affairs." },
      links: [
        { label: "About", href: "#about" },
        { label: "Accessibility statement", href: "#accessibility" },
      ],
    },
  },

  Header: {
    props: z.object({
      title: z.string().describe("Site title shown in the header"),
      navItems: z.array(
        z.object({
          label: z.string(),
          href: z.string(),
          current: z.boolean().nullish(),
        })
      ).nullish().describe("Primary nav links"),
      basic: z.boolean().nullish().describe("Use basic (non-extended) header variant (default true)"),
      className: z.string().nullish(),
    }),
    description: "USWDS site header with title and optional primary navigation. Use with caution — limited AI support for megamenu or extended variants.",
    example: {
      title: "Agency Portal",
      navItems: [
        { label: "Home", href: "/", current: true },
        { label: "Benefits", href: "/benefits" },
        { label: "Contact", href: "/contact" },
      ],
    },
  },

  Footer: {
    props: z.object({
      columns: z.array(
        z.object({
          heading: z.string(),
          links: z.array(z.object({ label: z.string(), href: z.string() })),
        })
      ).nullish().describe("Navigation columns for the slim/medium footer"),
      logoSrc: z.string().nullish(),
      logoAlt: z.string().nullish(),
      size: z.enum(["slim", "medium", "big"]).nullish().describe("Footer size variant (default 'slim')"),
      className: z.string().nullish(),
    }),
    description: "USWDS site footer. Use with caution — limited AI support for big footer variant. Column headings are collected but not rendered in the slim layout adapter.",
    example: {
      size: "slim",
      columns: [
        {
          heading: "About",
          links: [
            { label: "Mission & vision", href: "#mission" },
            { label: "Leadership", href: "#leadership" },
          ],
        },
      ],
    },
  },

  LanguageSelector: {
    props: z.object({
      langs: z.array(
        z.object({
          label: z.string().describe("Language name in the target language, e.g. 'Español'"),
          lang: z.string().describe("BCP-47 lang code, e.g. 'es'"),
          href: z.string().nullish(),
        })
      ).describe("Language options"),
      small: z.boolean().nullish().describe("Compact display variant"),
      className: z.string().nullish(),
    }),
    description: "USWDS language selector for multilingual sites.",
    example: {
      langs: [
        { label: "English", lang: "en" },
        { label: "Español", lang: "es" },
      ],
    },
  },

  IconList: {
    props: z.object({
      items: z.array(
        z.object({
          iconName: z.string().describe("Icon name from Truss Icon namespace, e.g. 'Check', 'Close'"),
          text: z.string().describe("Text content for this list item"),
          iconColor: z.string().nullish().describe("CSS color class for the icon"),
        })
      ).describe("Icon list items"),
      className: z.string().nullish(),
    }),
    description: "USWDS icon list — an unordered list where each item has a leading USWDS icon.",
    example: {
      items: [
        { iconName: "Check", text: "Direct deposit available" },
        { iconName: "Check", text: "Online application" },
        { iconName: "Close", text: "Paper forms discontinued" },
      ],
    },
  },

  MediaBlock: {
    props: z.object({
      imgSrc: z.string().describe("Image URL"),
      imgAlt: z.string().nullish(),
      heading: z.string().nullish(),
      body: z.string().nullish().describe("Body text rendered next to the image"),
      reversed: z.boolean().nullish().describe("Places image on the right side"),
      className: z.string().nullish(),
    }),
    description: "USWDS media block — image paired with text content. Use with caution — limited AI support for complex slot compositions.",
    example: {
      imgSrc: "https://designsystem.digital.gov/img/home/hero.png",
      imgAlt: "USWDS hero image",
      heading: "Design for impact",
      body: "Build accessible, mobile-friendly government websites faster with USWDS.",
    },
  },

  ComboBox: {
    props: z.object({
      id: z.string(),
      name: z.string(),
      options: z.array(
        z.object({ value: z.string(), label: z.string() })
      ).describe("List of selectable options"),
      defaultValue: z.string().nullish(),
      disabled: z.boolean().nullish(),
      assistiveHint: z.string().nullish(),
      noResults: z.string().nullish().describe("Message shown when no options match input"),
      onChange: z.string().nullish().describe("Action binding name — called with selected value string or null"),
    }),
    description: "USWDS combo box — filterable select with keyboard navigation.",
    example: {
      id: "fruit",
      name: "fruit",
      options: [
        { value: "apple", label: "Apple" },
        { value: "banana", label: "Banana" },
        { value: "cherry", label: "Cherry" },
      ],
    },
  },

  DatePicker: {
    props: z.object({
      id: z.string(),
      name: z.string(),
      validationStatus: z.enum(["error", "success"]).nullish(),
      disabled: z.boolean().nullish(),
      required: z.boolean().nullish(),
      defaultValue: z.string().nullish().describe("ISO date string YYYY-MM-DD"),
      minDate: z.string().nullish().describe("Earliest selectable date, YYYY-MM-DD"),
      maxDate: z.string().nullish().describe("Latest selectable date, YYYY-MM-DD"),
      label: z.string().nullish().describe("Accessible label rendered above the field"),
    }),
    description: "USWDS date picker with calendar popover.",
    example: { id: "appt-date", name: "apptDate", label: "Appointment date" },
  },

  DateRangePicker: {
    props: z.object({
      startDateId: z.string(),
      startDateName: z.string(),
      endDateId: z.string(),
      endDateName: z.string(),
      startDateLabel: z.string().nullish(),
      endDateLabel: z.string().nullish(),
      minDate: z.string().nullish().describe("ISO date string YYYY-MM-DD"),
      maxDate: z.string().nullish().describe("ISO date string YYYY-MM-DD"),
    }),
    description: "USWDS date range picker — two linked date pickers for start and end dates.",
    example: {
      startDateId: "start",
      startDateName: "startDate",
      endDateId: "end",
      endDateName: "endDate",
      startDateLabel: "Start date",
      endDateLabel: "End date",
    },
  },

  FileInput: {
    props: z.object({
      id: z.string(),
      name: z.string(),
      multiple: z.boolean().nullish().describe("Allow multiple file selection"),
      accept: z.string().nullish().describe("Accepted MIME types or extensions, e.g. '.pdf,.docx'"),
      disabled: z.boolean().nullish(),
      dragText: z.string().nullish().describe("Text shown in drag target"),
      chooseText: z.string().nullish().describe("Text for the choose-file button"),
      label: z.string().nullish(),
    }),
    description: "USWDS file input with drag-and-drop support.",
    example: { id: "doc-upload", name: "docUpload", accept: ".pdf,.docx", label: "Upload supporting documents" },
  },

  RangeInput: {
    props: z.object({
      id: z.string(),
      name: z.string(),
      min: z.number().nullish(),
      max: z.number().nullish(),
      step: z.number().nullish(),
      defaultValue: z.number().nullish(),
      disabled: z.boolean().nullish(),
      label: z.string().nullish(),
    }),
    description: "USWDS range input (slider).",
    example: { id: "satisfaction", name: "satisfaction", min: 1, max: 10, step: 1, label: "Satisfaction (1–10)" },
  },

  TimePicker: {
    props: z.object({
      id: z.string(),
      name: z.string(),
      defaultValue: z.string().nullish().describe("Default time string HH:MM"),
      minTime: z.string().nullish().describe("Earliest selectable time HH:MM"),
      maxTime: z.string().nullish().describe("Latest selectable time HH:MM"),
      step: z.number().nullish().describe("Minute increment between options (default 30)"),
      disabled: z.boolean().nullish(),
      label: z.string().nullish(),
    }),
    description: "USWDS time picker dropdown.",
    example: { id: "appt-time", name: "apptTime", label: "Appointment time", minTime: "09:00", maxTime: "17:00" },
  },

  FormGroup: {
    props: z.object({
      error: z.boolean().nullish().describe("Applies error styling to the group"),
      className: z.string().nullish(),
    }),
    slots: ["default"],
    description: "USWDS form group wrapper — groups a label, input, and optional error message with consistent spacing.",
    example: { error: false },
  },

  Label: {
    props: z.object({
      htmlFor: z.string().describe("id of the associated form control"),
      text: z.string().describe("Label text content"),
      hint: z.string().nullish().describe("Hint text shown below the label"),
      error: z.boolean().nullish().describe("Applies error styling to the label"),
      className: z.string().nullish(),
    }),
    description: "USWDS form label.",
    example: { htmlFor: "first-name", text: "First name", hint: "As it appears on your ID" },
  },

  ErrorMessage: {
    props: z.object({
      text: z.string().describe("Error message text"),
      id: z.string().nullish().describe("id for aria-describedby association"),
    }),
    description: "USWDS inline form error message.",
    example: { text: "Enter a valid date of birth.", id: "dob-error" },
  },

  CharacterCount: {
    props: z.object({
      id: z.string(),
      name: z.string(),
      maxLength: z.number().int().positive().describe("Maximum number of characters allowed"),
      isTextArea: z.boolean().nullish().describe("Renders a textarea instead of an input"),
      defaultValue: z.string().nullish(),
      label: z.string().nullish().describe("Accessible label text rendered with the field"),
    }),
    description: "USWDS character count — input or textarea with live remaining-character count.",
    example: { id: "comments", name: "comments", maxLength: 150, isTextArea: true, label: "Additional comments" },
  },

  TextInputMask: {
    props: z.object({
      id: z.string(),
      name: z.string(),
      mask: z.string().describe("Input mask pattern string, e.g. '___ - __ - ____' for SSN"),
      label: z.string().describe("Accessible label text"),
      type: z.enum(["text", "tel", "email", "number", "search", "url"]).nullish(),
      defaultValue: z.string().nullish(),
      disabled: z.boolean().nullish(),
    }),
    description: "USWDS text input with a display mask (e.g. SSN, phone number).",
    example: { id: "ssn", name: "ssn", mask: "___ - __ - ____", label: "Social Security Number" },
  },
} satisfies Record<string, ComponentDefinition>;

export type UswdsProps = {
  [K in keyof typeof uswdsComponentDefinitions]: z.infer<
    (typeof uswdsComponentDefinitions)[K]["props"]
  >;
};

/**
 * Components that existed in the previous CVA/Radix implementation but have
 * no @trussworks/react-uswds equivalent and are not part of the USWDS design
 * system. Explicitly dropped rather than silently removed.
 */
export const UNSUPPORTED_COMPONENTS = [
  "Avatar",
  "Carousel",
  "Collapsible",
  "Dialog",
  "Drawer",
  "DropdownMenu",
  "Image",
  "Popover",
  "Progress",
  "Separator",
  "Skeleton",
  "Slider",
  "Spinner",
  "Stack",
  "Switch",
  "Tabs",
  "ToggleGroup",
  "Toggle",
] as const;
