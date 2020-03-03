class Permission {
  public resource!: string;
  public action!: string;
  public attributes!: string;

  constructor(acl: any) {
    this.resource = acl.permissions.resource;
    this.action = acl.permissions.action;
    this.attributes = acl.permissions.attributes;
  }
}

export default Permission;
