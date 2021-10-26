import * as pulumi from '@pulumi/pulumi'
import { OrganizationStackReference } from '@vizv/pulumi-utilities'
import * as minio from './lib'

const infrastructureStack = new OrganizationStackReference('infra-foundation')
const baseDomain = infrastructureStack.getOutput('baseDomain')

const resource = new minio.Minio('minio', {
  baseDomain: pulumi.interpolate`minio.${baseDomain}`,
  dashboardDomain: pulumi.interpolate`minio-dashboard.${baseDomain}`,
})

export const { accessKeyId, secretAccessKey } = resource.minio.credentials
