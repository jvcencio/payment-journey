export type Confidence = 'EXPLICIT' | 'DETERMINISTIC' | 'INFERRED' | 'UNKNOWN';
export type Role = 'DEBTOR' | 'CREDITOR' | (string & {});
export type AddressComponent =
  | 'careOf'
  | 'department'
  | 'subDepartment'
  | 'streetName'
  | 'buildingNumber'
  | 'buildingName'
  | 'floor'
  | 'unitNumber'
  | 'postBox'
  | 'room'
  | 'postCode'
  | 'townName'
  | 'townLocationName'
  | 'districtName'
  | 'countrySubdivision'
  | 'country';
export interface Locator {
  path: string;
  start: number;
  end: number;
  line: number;
  column: number;
}
export interface Artifact {
  artifactId: string;
  formatFamily: 'MT' | 'pacs';
  messageType: string;
  messageVersion: string;
  parserVersion: string;
  rawPayloadReference: string;
  rawPayload: string;
  payloadHash: string;
  hashAlgorithm: 'SHA-256';
  encoding: 'UTF-8';
}
export interface PostalAddress {
  components: Partial<Record<AddressComponent, string>>;
  addressLines: string[];
  representation: 'STRUCTURED' | 'HYBRID' | 'UNSTRUCTURED' | 'EMPTY';
}
export interface ParticipantOccurrence {
  occurrenceId: string;
  role: Role;
  kind: 'PARTY' | 'AGENT';
  identity: { nameRefs: string[]; identifierRefs: string[] };
  postalAddress: PostalAddress;
  accountRefs: string[];
}
export interface PaymentTransaction {
  transactionId: string;
  participants: ParticipantOccurrence[];
}
export interface SemanticNode {
  elementId: string;
  artifactId: string;
  transactionId: string;
  participantOccurrenceId: string;
  role: Role;
  semanticPath: string;
  occurrence: number;
  value: string;
  rawValue: string;
  sourceLocator: Locator;
  interpretationMethod: string;
  interpretationConfidence: Confidence;
  material: boolean;
  evidenceRefs: string[];
}
export interface EvidenceReference {
  evidenceId: string;
  artifactId: string;
  locator: Locator;
  rawValue: string;
  kind: 'ARTIFACT';
}
export interface UnmappedElement {
  artifactId: string;
  locator: Locator;
  rawValue: string;
  reason: string;
}
export interface Diagnostic {
  code: string;
  message: string;
  locator?: Locator;
}
export interface CanonicalPaymentSnapshot {
  snapshotId: string;
  artifactId: string;
  schemaVersion: '0.1.0';
  parserVersion: string;
  transactions: PaymentTransaction[];
  nodes: SemanticNode[];
  evidence: EvidenceReference[];
}
export type ParseResult =
  | {
      ok: true;
      artifact: Artifact;
      snapshot: CanonicalPaymentSnapshot;
      unmapped: UnmappedElement[];
      warnings: Diagnostic[];
      coverage: Coverage;
    }
  | { ok: false; artifact: Artifact; diagnostics: Diagnostic[] };
export interface Coverage {
  wellFormed: true;
  supportedMessage: true;
  semanticScope: string;
  materialElements: number;
  uninterpretedItems: number;
  fullSchemaValidation: false;
  networkProfileValidation: false;
}
export type EventName =
  | 'PRESERVED'
  | 'NORMALIZED'
  | 'STRUCTURED'
  | 'DERIVED'
  | 'COLLAPSED'
  | 'MISPLACED'
  | 'TRUNCATED'
  | 'LOST'
  | 'DUPLICATED'
  | 'ALTERED'
  | 'DEFAULTED'
  | 'ENRICHED'
  | 'UNSOURCED'
  | 'CONFLICTING'
  | 'UNSUPPORTED';
export type TaxonomyEvent =
  | { type: Exclude<EventName, 'UNSUPPORTED'> }
  | {
      type: 'UNSUPPORTED';
      scope:
        | 'FORMAT'
        | 'NETWORK_PROFILE'
        | 'VENDOR_IMPLEMENTATION'
        | 'SYSTEM_CONFIGURATION'
        | 'UNKNOWN';
    };
export interface LineageEdge {
  edgeId: string;
  sourceElementIds: string[];
  targetElementIds: string[];
  transformationId: string;
  taxonomyEvents: TaxonomyEvent[];
  confidence: Confidence;
  evidenceRefs: string[];
  relationshipGroupId?: string;
}
export interface Transformation {
  transformationId: string;
  sourceArtifactIds: string[];
  targetArtifactIds: string[];
  pairing: 'USER_SUPPLIED';
}
export interface UnresolvedObservation {
  elementId: string;
  side: 'SOURCE' | 'TARGET';
  reason: string;
  candidateElementIds: string[];
}
export interface ProvenanceGraph {
  semanticNodes: SemanticNode[];
  lineageEdges: LineageEdge[];
  unresolved: UnresolvedObservation[];
}
export interface LineageReport {
  source: Extract<ParseResult, { ok: true }>;
  target: Extract<ParseResult, { ok: true }>;
  transformation: Transformation;
  graph: ProvenanceGraph;
}
