export interface PaletteItem {
  kind: string;
  label: string;
}

export interface PaletteCategory {
  name: string;
  accent: string;
  items: PaletteItem[];
}

/**
 * Data-driven component palette. Adding a new component is just a new entry —
 * generic kinds render as labeled boxes; a handful of kinds (class, interface,
 * database, …) have dedicated rendering in ShapeNode.
 */
export const PALETTE: PaletteCategory[] = [
  {
    name: "Basic Shapes",
    accent: "#8C8E97",
    items: [
      { kind: "box", label: "Normal Box" },
      { kind: "text", label: "Text Box" },
      { kind: "heading", label: "Heading Box" },
      { kind: "rounded", label: "Rounded Box" },
      { kind: "note", label: "Note Box" },
      { kind: "divider", label: "Divider" },
      { kind: "text", label: "Floating Text" }
    ]
  },
  {
    name: "UML",
    accent: "#8B7FF0",
    items: [
      { kind: "class", label: "Class" },
      { kind: "interface", label: "Interface" },
      { kind: "abstract", label: "Abstract Class" },
      { kind: "enum", label: "Enum" },
      { kind: "object", label: "Object" },
      { kind: "box", label: "Package" },
      { kind: "box", label: "Component" },
      { kind: "database", label: "Database" },
      { kind: "actor", label: "Actor" }
    ]
  },
  {
    name: "DSA",
    accent: "#7DC4A0",
    items: [
      { kind: "box", label: "Array" },
      { kind: "box", label: "Linked List Node" },
      { kind: "box", label: "Binary Tree Node" },
      { kind: "box", label: "Graph Node" },
      { kind: "box", label: "Trie Node" },
      { kind: "box", label: "Heap Node" },
      { kind: "box", label: "Queue" },
      { kind: "box", label: "Stack" },
      { kind: "box", label: "Hash Table" },
      { kind: "text", label: "Pointer" }
    ]
  },
  {
    name: "System Design",
    accent: "#5BA3E0",
    items: [
      { kind: "box", label: "Microservice" },
      { kind: "box", label: "API Gateway" },
      { kind: "box", label: "Load Balancer" },
      { kind: "box", label: "Cache" },
      { kind: "box", label: "Redis" },
      { kind: "box", label: "Kafka" },
      { kind: "box", label: "RabbitMQ" },
      { kind: "database", label: "MongoDB" },
      { kind: "database", label: "MySQL" },
      { kind: "database", label: "Postgres" },
      { kind: "box", label: "ElasticSearch" },
      { kind: "box", label: "S3" },
      { kind: "box", label: "CDN" },
      { kind: "box", label: "Server" },
      { kind: "box", label: "Client" },
      { kind: "box", label: "Browser" },
      { kind: "box", label: "Docker" },
      { kind: "box", label: "Kubernetes" }
    ]
  }
];

export interface EdgeKindDef {
  kind: string;
  label: string;
}

export const EDGE_KINDS: EdgeKindDef[] = [
  { kind: "arrow", label: "Simple Arrow" },
  { kind: "line", label: "Line" },
  { kind: "dashed", label: "Dashed Arrow" },
  { kind: "bidirectional", label: "Bidirectional" },
  { kind: "association", label: "Association" },
  { kind: "inheritance", label: "Inheritance" },
  { kind: "composition", label: "Composition" },
  { kind: "aggregation", label: "Aggregation" },
  { kind: "dependency", label: "Dependency" },
  { kind: "curved", label: "Curved" },
  { kind: "orthogonal", label: "Orthogonal" }
];
