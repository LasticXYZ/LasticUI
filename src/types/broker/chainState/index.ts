// workplan types
type AssignmentItem = { Task: number };
type AssignmentItemUnf = { Task: string };
type WorkplanAssignmentInfo = { mask: string; assignment: AssignmentItem | 'Pool' };
type WorkplanAssignmentInfoUnf = { mask: string; assignment: AssignmentItemUnf | 'Pool' };
type WorkplanCoreInfo = { begin: number; core: number };
type Workplan = { coreInfo: WorkplanCoreInfo; assignmentInfo: WorkplanAssignmentInfo[] };
type WorkplanType = Workplan[];

export {
    type AssignmentItem,
    type AssignmentItemUnf, type Workplan, type WorkplanAssignmentInfo,
    type WorkplanAssignmentInfoUnf,
    type WorkplanCoreInfo, type WorkplanType
};
