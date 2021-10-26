import * as k8s from '@pulumi/kubernetes'
import * as pulumi from '@pulumi/pulumi'
import * as minio from '@vizv/module-minio'

export interface MinioArgs {
  baseDomain: pulumi.Input<string>
  dashboardDomain: pulumi.Input<string>
}

export class Minio extends pulumi.ComponentResource {
  public readonly minioNamespace: k8s.core.v1.Namespace
  public readonly minio: minio.Minio

  constructor(
    name: string,
    args: MinioArgs,
    opts?: pulumi.ComponentResourceOptions,
  ) {
    super('vizv:infra:Minio', name, {}, opts)

    this.minioNamespace = new k8s.core.v1.Namespace(
      'minio',
      {
        metadata: {
          name: 'infra-minio-minio',
        },
      },
      {
        parent: this,
        protect: opts?.protect,
        dependsOn: opts?.dependsOn,
      },
    )

    this.minio = new minio.Minio(
      'minio',
      {
        namespaceName: this.minioNamespace.metadata.name,
        baseDomain: args.baseDomain,
        dashboardDomain: args.dashboardDomain,
      },
      {
        parent: this,
        protect: opts?.protect,
        dependsOn: this.minioNamespace,
      },
    )
  }
}
