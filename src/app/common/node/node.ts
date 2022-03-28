export class Node {
    id?: number;
    nodeName?: string;
    parentNodeId?: any;
    value?: number;
    children?: Node[];
  
  
    constructor(id?: number, nodeName?: string, parentNodeId?: any, value?: number, children?: Node[]) {
      this.id = id;
      this.nodeName = nodeName;
      this.parentNodeId = parentNodeId;
      this.value = value;
      this.children = children;
    }
  }