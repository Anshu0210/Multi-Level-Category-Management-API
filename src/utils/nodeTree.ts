export interface TreeNode {
    _id: string;
    name: string;
    parent?: string | null;
    children?: TreeNode[];
    createdBy: string;
    status: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

export function buildTree(data: TreeNode[]): TreeNode[] {
    const idMap: Record<string, TreeNode> = {};
    const tree: TreeNode[] = [];

    // Create map with default children array
    data.forEach(item => {
        idMap[item._id] = { ...item, children: [] };
    });

    // Build the tree structure
    data.forEach(item => {
        if (item.parent) {
            const parent = idMap[item.parent];
            if (parent) {
                parent.children!.push(idMap[item._id]);
            }
        } else {
            tree.push(idMap[item._id]);
        }
    });

    return tree;
}

export function cleanMongooseTree(node: any) {
    const doc = node._doc || node;

    const cleaned = {
        _id: doc._id,
        name: doc.name,
        parent: doc.parent,
        createdBy: doc.createdBy,
        status: doc.status,
        isDeleted: doc.isDeleted,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
        __v: doc.__v,
        children: (node.children || []).map(cleanMongooseTree)
    };

    return cleaned;
}

