// workplan types
type AssignmentItem = { Task: number }
type AssignmentItemUnf = { Task: string }
type WorkplanAssignmentInfo = { mask: string; assignment: AssignmentItem | 'Pool' }
type WorkplanAssignmentInfoUnf = { mask: string; assignment: AssignmentItemUnf | 'Pool' }
type WorkplanCoreInfo = { begin: number; core: number }
type Workplan = { coreInfo: WorkplanCoreInfo; assignmentInfo: WorkplanAssignmentInfo[] }
type WorkplanType = Workplan[]

// allowedRenewals types
type AllowedRenewalCoreInfo = { core: number; when: number }
type AllowedRenewalCoreInfoUnf = { core: string; when: string }
type AllowedRenewalAssignmentItem = { Task: number }
type AllowedRenewalAssignmentItemUnf = { Task: string }
type CompletionInfo = {
  mask: string
  assignment: AllowedRenewalAssignmentItemUnf
}
type AllowedRenewalAssignmentInfo = {
  price: string
  completion: {
    Complete: CompletionInfo[]
  }
}
type AllowedRenewals = {
  coreInfo: AllowedRenewalCoreInfoUnf[]
  assignmentInfo: AllowedRenewalAssignmentInfo
}
type AllowedRenewalsType = AllowedRenewals[]

export {
  type AllowedRenewalAssignmentInfo,
  type AllowedRenewalAssignmentItem,
  type AllowedRenewalAssignmentItemUnf,
  type AllowedRenewalCoreInfo,
  type AllowedRenewalCoreInfoUnf,
  type AllowedRenewals,
  type AllowedRenewalsType,
  type AssignmentItem,
  type AssignmentItemUnf,
  type CompletionInfo,
  type Workplan,
  type WorkplanAssignmentInfo,
  type WorkplanAssignmentInfoUnf,
  type WorkplanCoreInfo,
  type WorkplanType,
}
