interface Res<T = any> {
  code: number
  data: T
  msg: string
  pageNum: number
  pageSize: number
  total: number
}

interface ApiType {
  /* 【日志管理】
  // 日志列表
  export function iamSysActionLogList(payload: SysActionLogListDTO) {return http.post<Res<SysActionLogVO[]>>('/iam/sys-action-log/list', payload)}
  */
  '/iam/sys-action-log/list': {Req: SysActionLogListDTO; Res: SysActionLogVO[]}

  /* 【日志管理】
  // 日志列表导出
  export function iamSysActionLogListExport(payload: SysActionLogListDTO) {return http.post<Res<>>('/iam/sys-action-log/list-export', payload)}
  */
  '/iam/sys-action-log/list-export': {Req: SysActionLogListDTO}

  /* 【日志管理】
  // 清空日志
  export function iamSysActionLogClear(payload: SysActionLogListDTO) {return http.post<Res<Record<string, any>>>('/iam/sys-action-log/clear', payload)}
  */
  '/iam/sys-action-log/clear': {Req: SysActionLogListDTO; Res: Record<string, any>}

  /* 【开放平台应用】
  // 新增/修改应用
  export function iamOpenAppUpsert(payload: OpenAppUpsertDTO) {return http.post<Res<string>>('/iam/open-app/upsert', payload)}
  */
  '/iam/open-app/upsert': {Req: OpenAppUpsertDTO; Res: string}

  /* 【开放平台应用】
  // 应用列表
  export function iamOpenAppList(payload: OpenAppListDTO) {return http.post<Res<OpenAppVO[]>>('/iam/open-app/list', payload)}
  */
  '/iam/open-app/list': {Req: OpenAppListDTO; Res: OpenAppVO[]}

  /* 【开放平台应用】
  // 应用详情 | object:{appId:应用ID}
  export function iamOpenAppGet(payload: {appId: any}) {return http.post<Res<OpenAppVO>>('/iam/open-app/get', payload)}
  */
  '/iam/open-app/get': {Req: {appId: any}; Res: OpenAppVO}

  /* 【开放平台应用】
  // 启用/禁用应用 | object:{appId:应用ID,enable:bool,enableNotes:原因}
  export function iamOpenAppEnable(payload: {appId: any; enable: boolean; enableNotes: any}) {return http.post<Res<Record<string, any>>>('/iam/open-app/enable', payload)}
  */
  '/iam/open-app/enable': {Req: {appId: any; enable: boolean; enableNotes: any}; Res: Record<string, any>}

  /* 【开放平台应用】
  // 删除应用 | object:{appId:应用ID}
  export function iamOpenAppDelete(payload: {appId: any}) {return http.post<Res<Record<string, any>>>('/iam/open-app/delete', payload)}
  */
  '/iam/open-app/delete': {Req: {appId: any}; Res: Record<string, any>}

  /* 【通用相关】
  // 中文转拼音 | object:{key:中文}
  export function iamCommonFuncZhToPinyin(payload: {key: any}) {return http.post<Res<string>>('/iam/common/func/zh-to-pinyin', payload)}
  */
  '/iam/common/func/zh-to-pinyin': {Req: {key: any}; Res: string}

  /* 【通用相关】
  // 身份证判断男女 | object:{certNo:身份证}
  export function iamCommonFuncCertNoToGender(payload: {certNo: any}) {return http.post<Res<string>>('/iam/common/func/certNo-to-gender', payload)}
  */
  '/iam/common/func/certNo-to-gender': {Req: {certNo: any}; Res: string}

  /* 【通用相关】
  // 文件上传(type,file)
  export function iamCommonFileUpload() {return http.post<Res<FileModel>>('/iam/common/file/upload')}
  */
  '/iam/common/file/upload': {Res: FileModel}

  /* 【通用相关】
  // 文件上传(type,file,filename)
  export function iamCommonFileUploadBase64() {return http.post<Res<FileModel>>('/iam/common/file/upload-base64')}
  */
  '/iam/common/file/upload-base64': {Res: FileModel}

  /* 【通用相关】
  // 文件ID转文件Model,入参[id1,id2]
  export function iamCommonFileIdToPath() {return http.post<Res<FileModel[]>>('/iam/common/file/id-to-path')}
  */
  '/iam/common/file/id-to-path': {Res: FileModel[]}

  /* 【通用相关】
  // 码表元信息
  export function iamCommonDicMeta(payload: Record<string, any>) {return http.post<Res<Record<string, Record<string, any>>[]>>('/iam/common/dic/meta', payload)}
  */
  '/iam/common/dic/meta': {Req: Record<string, any>; Res: Record<string, Record<string, any>>[]}

  /* 【通用相关】
  // 树形码表 | object:{dicType:字典类型}
  export function iamCommonDicListTree(payload: {dicType: any}) {return http.post<Res<SysDicVO[]>>('/iam/common/dic/list-tree', payload)}
  */
  '/iam/common/dic/list-tree': {Req: {dicType: any}; Res: SysDicVO[]}

  /* 【通用相关】
  // 常规码表
  export function iamCommonDicListAll(payload: Record<string, any>) {return http.post<Res<Record<string, SysDicVO[]>>>('/iam/common/dic/list-all', payload)}
  */
  '/iam/common/dic/list-all': {Req: Record<string, any>; Res: Record<string, SysDicVO[]>}

  /* 【通用相关】
  // 省_市_区_商圈 | object:{pid:上级ID}
  export function iamCommonAreaList(payload: {pid: any}) {return http.post<Res<PairModel[]>>('/iam/common/area/list', payload)}
  */
  '/iam/common/area/list': {Req: {pid: any}; Res: PairModel[]}

  /* 【通用相关】
  // 根据城市查询区和街道(树) | object:{cityCode:城市CODE}
  export function iamCommonAreaCityInfo(payload: {cityCode: any}) {return http.post<Res<Record<string, TreeModel[]>>>('/iam/common/area/city-info', payload)}
  */
  '/iam/common/area/city-info': {Req: {cityCode: any}; Res: Record<string, TreeModel[]>}

  /* 【登录认证】
  // 设置密码 | object:{loginPwdOrigin:原登录密码,loginPwd:新登录密码}
  export function iamAuthUpdatePwd(payload: {loginPwdOrigin: any; loginPwd: any}) {return http.post<Res<Record<string, any>>>('/iam/auth/update-pwd', payload)}
  */
  '/iam/auth/update-pwd': {Req: {loginPwdOrigin: any; loginPwd: any}; Res: Record<string, any>}

  /* 【登录认证】
  // 初次设置密码 | object:{loginPwd:登录密码}
  export function iamAuthUpdatePwdInit(payload: {loginPwd: any}) {return http.post<Res<Record<string, any>>>('/iam/auth/update-pwd-init', payload)}
  */
  '/iam/auth/update-pwd-init': {Req: {loginPwd: any}; Res: Record<string, any>}

  /* 【登录认证】
  // 获取SSO票据 | object:{appId:应用Id}
  export function iamAuthSsoTicket(payload: {appId: any}) {return http.post<Res<string>>('/iam/auth/sso-ticket', payload)}
  */
  '/iam/auth/sso-ticket': {Req: {appId: any}; Res: string}

  /* 【登录认证】
  // 发送验证码 | object:{mobile:手机号}
  export function iamAuthSendVerifyCode(payload: {mobile: any}) {return http.post<Res<string>>('/iam/auth/send-verifyCode', payload)}
  */
  '/iam/auth/send-verifyCode': {Req: {mobile: any}; Res: string}

  /* 【登录认证】
  // 登出
  export function iamAuthLogout(payload: Record<string, any>) {return http.post<Res<Record<string, any>>>('/iam/auth/logout', payload)}
  */
  '/iam/auth/logout': {Req: Record<string, any>; Res: Record<string, any>}

  /* 【登录认证】
  // 登录
  export function iamAuthLogin(payload: AuthLoginDTO) {return http.post<Res<string>>('/iam/auth/login', payload)}
  */
  '/iam/auth/login': {Req: AuthLoginDTO; Res: string}

  /* 【登录认证】
  // 获取用户信息
  export function iamAuthInfo() {return http.post<Res<AuthUserModelVO>>('/iam/auth/info')}
  */
  '/iam/auth/info': {Res: AuthUserModelVO}

  /* 【登录认证】
  // 获取图片验证码
  export function iamAuthGetImgCode() {return http.post<Res<Record<string, string>>>('/iam/auth/get-imgCode')}
  */
  '/iam/auth/get-imgCode': {Res: Record<string, string>}

  /* 【登录认证】
  // 校验验证码 | object:{mobile:手机号,verifyCode:验证码}
  export function iamAuthCheckVerifyCode(payload: {mobile: any; verifyCode: any}) {return http.post<Res<boolean>>('/iam/auth/check-verifyCode', payload)}
  */
  '/iam/auth/check-verifyCode': {Req: {mobile: any; verifyCode: any}; Res: boolean}

  /* 【登录认证】
  // 校验图片验证码 | object:{imgId:图片验证码Id,imgCode:图片验证码}
  export function iamAuthCheckImgCode(payload: {imgId: any; imgCode: any}) {return http.post<Res<boolean>>('/iam/auth/check-imgCode', payload)}
  */
  '/iam/auth/check-imgCode': {Req: {imgId: any; imgCode: any}; Res: boolean}

  /* 【登录认证】
  // 绑定企业微信 | object:{code:企业微信code}
  export function iamAuthBindWework(payload: {code: any}) {return http.post<Res<Record<string, any>>>('/iam/auth/bind-wework', payload)}
  */
  '/iam/auth/bind-wework': {Req: {code: any}; Res: Record<string, any>}

  /* 【人员管理】
  // 新增/更新人员
  export function iamAuthUserUpsert(payload: AuthUserUpsertDTO) {return http.post<Res<string>>('/iam/auth-user/upsert', payload)}
  */
  '/iam/auth-user/upsert': {Req: AuthUserUpsertDTO; Res: string}

  /* 【人员管理】
  // 修改角色
  export function iamAuthUserUpdateRole(payload: AuthUserUpdateRoleDTO) {return http.post<Res<Record<string, any>>>('/iam/auth-user/update-role', payload)}
  */
  '/iam/auth-user/update-role': {Req: AuthUserUpdateRoleDTO; Res: Record<string, any>}

  /* 【人员管理】
  // 修改部门
  export function iamAuthUserUpdateOrg(payload: AuthUserUpdateOrgDTO) {return http.post<Res<Record<string, any>>>('/iam/auth-user/update-org', payload)}
  */
  '/iam/auth-user/update-org': {Req: AuthUserUpdateOrgDTO; Res: Record<string, any>}

  /* 【人员管理】
  // 导入步骤4: 导入人员 | object:{fid:文件ID}
  export function iamAuthUserTemplateImport(payload: {fid: any}) {return http.post<Res<number>>('/iam/auth-user/template-import', payload)}
  */
  '/iam/auth-user/template-import': {Req: {fid: any}; Res: number}

  /* 【人员管理】
  // 导入步骤1: 导出上传模板
  export function iamAuthUserTemplateExport(payload: Record<string, any>) {return http.post<Res<>>('/iam/auth-user/template-export', payload)}
  */
  '/iam/auth-user/template-export': {Req: Record<string, any>}

  /* 【人员管理】
  // 导入步骤2: 校验上传模板 | object:{fid:文件ID}
  export function iamAuthUserTemplateCheck(payload: {fid: any}) {return http.post<Res<UserTemplateImportCheckVO>>('/iam/auth-user/template-check', payload)}
  */
  '/iam/auth-user/template-check': {Req: {fid: any}; Res: UserTemplateImportCheckVO}

  /* 【人员管理】
  // 导入步骤3: 下载校验后的模板 | object:{fid:文件ID}
  export function iamAuthUserTemplateCheckExport(payload: {fid: any}) {return http.post<Res<>>('/iam/auth-user/template-check-export', payload)}
  */
  '/iam/auth-user/template-check-export': {Req: {fid: any}}

  /* 【人员管理】
  // 重置密码 | object:{userId:人员ID,remark:备注}
  export function iamAuthUserResetPassword(payload: {userId: any; remark: any}) {return http.post<Res<Record<string, any>>>('/iam/auth-user/reset-password', payload)}
  */
  '/iam/auth-user/reset-password': {Req: {userId: any; remark: any}; Res: Record<string, any>}

  /* 【人员管理】
  // 人员列表
  export function iamAuthUserList(payload: AuthUserListDTO) {return http.post<Res<AuthUserVO[]>>('/iam/auth-user/list', payload)}
  */
  '/iam/auth-user/list': {Req: AuthUserListDTO; Res: AuthUserVO[]}

  /* 【人员管理】
  // 登录日志列表
  export function iamAuthUserListLoginLog(payload: AuthUserLoginLogListDTO) {return http.post<Res<AuthUserLoginLogVO[]>>('/iam/auth-user/list-login-log', payload)}
  */
  '/iam/auth-user/list-login-log': {Req: AuthUserLoginLogListDTO; Res: AuthUserLoginLogVO[]}

  /* 【人员管理】
  // 人员列表导出
  export function iamAuthUserListExport(payload: AuthUserListDTO) {return http.post<Res<>>('/iam/auth-user/list-export', payload)}
  */
  '/iam/auth-user/list-export': {Req: AuthUserListDTO}

  /* 【人员管理】
  // 人员列表导出(字段元数据)
  export function iamAuthUserListExportMeta(payload: Record<string, any>) {return http.post<Res<PairModel[]>>('/iam/auth-user/list-export-meta', payload)}
  */
  '/iam/auth-user/list-export-meta': {Req: Record<string, any>; Res: PairModel[]}

  /* 【人员管理】
  // 是否当前手机号已存在 | object:{mobile:手机号}
  export function iamAuthUserIsMobileExist(payload: {mobile: any}) {return http.post<Res<boolean>>('/iam/auth-user/is-mobile-exist', payload)}
  */
  '/iam/auth-user/is-mobile-exist': {Req: {mobile: any}; Res: boolean}

  /* 【人员管理】
  // 是否当前登录账号已存在 | object:{loginAccount:登录账号}
  export function iamAuthUserIsLoginAccountExist(payload: {loginAccount: any}) {return http.post<Res<boolean>>('/iam/auth-user/is-loginAccount-exist', payload)}
  */
  '/iam/auth-user/is-loginAccount-exist': {Req: {loginAccount: any}; Res: boolean}

  /* 【人员管理】
  // 是否当前邮箱已存在 | object:{email:邮箱}
  export function iamAuthUserIsEmailExist(payload: {email: any}) {return http.post<Res<boolean>>('/iam/auth-user/is-email-exist', payload)}
  */
  '/iam/auth-user/is-email-exist': {Req: {email: any}; Res: boolean}

  /* 【人员管理】
  // 人员详情 | object:{userId:人员ID}
  export function iamAuthUserGet(payload: {userId: any}) {return http.post<Res<AuthUserVO>>('/iam/auth-user/get', payload)}
  */
  '/iam/auth-user/get': {Req: {userId: any}; Res: AuthUserVO}

  /* 【人员管理】
  // 启用/禁用人员 | object:{userIdList:人员ID列表,enable:bool,remark:备注}
  export function iamAuthUserEnable(payload: {userIdList: any; enable: boolean; remark: any}) {return http.post<Res<Record<string, any>>>('/iam/auth-user/enable', payload)}
  */
  '/iam/auth-user/enable': {Req: {userIdList: any; enable: boolean; remark: any}; Res: Record<string, any>}

  /* 【角色管理】
  // 新增/修改角色
  export function iamAuthRoleUpsert(payload: AuthRoleUpsertDTO) {return http.post<Res<string>>('/iam/auth-role/upsert', payload)}
  */
  '/iam/auth-role/upsert': {Req: AuthRoleUpsertDTO; Res: string}

  /* 【角色管理】
  // 角色列表
  export function iamAuthRoleList(payload: AuthRoleListDTO) {return http.post<Res<AuthRoleVO[]>>('/iam/auth-role/list', payload)}
  */
  '/iam/auth-role/list': {Req: AuthRoleListDTO; Res: AuthRoleVO[]}

  /* 【角色管理】
  // 角色详情 | object:{roleId:角色ID}
  export function iamAuthRoleGet(payload: {roleId: any}) {return http.post<Res<AuthRoleVO>>('/iam/auth-role/get', payload)}
  */
  '/iam/auth-role/get': {Req: {roleId: any}; Res: AuthRoleVO}

  /* 【角色管理】
  // 启用/禁用角色 | object:{roleId:角色ID,enable:bool,enableNotes:原因}
  export function iamAuthRoleEnable(payload: {roleId: any; enable: boolean; enableNotes: any}) {return http.post<Res<Record<string, any>>>('/iam/auth-role/enable', payload)}
  */
  '/iam/auth-role/enable': {Req: {roleId: any; enable: boolean; enableNotes: any}; Res: Record<string, any>}

  /* 【角色管理】
  // 删除角色 | object:{roleId:角色ID}
  export function iamAuthRoleDelete(payload: {roleId: any}) {return http.post<Res<Record<string, any>>>('/iam/auth-role/delete', payload)}
  */
  '/iam/auth-role/delete': {Req: {roleId: any}; Res: Record<string, any>}

  /* 【权限管理】
  // 新增/更新权限
  export function iamAuthPermissionUpsert(payload: AuthPermissionUpsertDTO) {return http.post<Res<string>>('/iam/auth-permission/upsert', payload)}
  */
  '/iam/auth-permission/upsert': {Req: AuthPermissionUpsertDTO; Res: string}

  /* 【权限管理】
  // 权限树
  export function iamAuthPermissionTree(payload: AuthPermissionListDTO) {return http.post<Res<Record<string, AuthPermissionVO[]>>>('/iam/auth-permission/tree', payload)}
  */
  '/iam/auth-permission/tree': {Req: AuthPermissionListDTO; Res: Record<string, AuthPermissionVO[]>}

  /* 【权限管理】
  // 权限列表
  export function iamAuthPermissionList(payload: AuthPermissionListDTO) {return http.post<Res<AuthPermissionVO[]>>('/iam/auth-permission/list', payload)}
  */
  '/iam/auth-permission/list': {Req: AuthPermissionListDTO; Res: AuthPermissionVO[]}

  /* 【权限管理】
  // 权限详情 | object:{permId:权限ID}
  export function iamAuthPermissionGet(payload: {permId: any}) {return http.post<Res<AuthPermissionVO>>('/iam/auth-permission/get', payload)}
  */
  '/iam/auth-permission/get': {Req: {permId: any}; Res: AuthPermissionVO}

  /* 【权限管理】
  // 启用/禁用权限 | object:{permId:权限ID,enable:bool}
  export function iamAuthPermissionEnable(payload: {permId: any; enable: boolean}) {return http.post<Res<Record<string, any>>>('/iam/auth-permission/enable', payload)}
  */
  '/iam/auth-permission/enable': {Req: {permId: any; enable: boolean}; Res: Record<string, any>}

  /* 【权限管理】
  // 删除权限
  export function iamAuthPermissionDelete(payload: Record<string, any>) {return http.post<Res<string>>('/iam/auth-permission/delete', payload)}
  */
  '/iam/auth-permission/delete': {Req: Record<string, any>; Res: string}

  /* 【组织管理】
  // 新增/修改组织
  export function iamAuthOrgUpsert(payload: AuthOrgUpsertDTO) {return http.post<Res<string>>('/iam/auth-org/upsert', payload)}
  */
  '/iam/auth-org/upsert': {Req: AuthOrgUpsertDTO; Res: string}

  /* 【组织管理】
  // 当前用户的组织树
  export function iamAuthOrgTree(payload: Record<string, any>) {return http.post<Res<AuthOrgVO[]>>('/iam/auth-org/tree', payload)}
  */
  '/iam/auth-org/tree': {Req: Record<string, any>; Res: AuthOrgVO[]}

  /* 【组织管理】
  // 组织列表
  export function iamAuthOrgList(payload: AuthOrgListDTO) {return http.post<Res<AuthOrgVO[]>>('/iam/auth-org/list', payload)}
  */
  '/iam/auth-org/list': {Req: AuthOrgListDTO; Res: AuthOrgVO[]}

  /* 【组织管理】
  // 组织详情 | object:{orgId:组织ID}
  export function iamAuthOrgGet(payload: {orgId: any}) {return http.post<Res<AuthOrgVO>>('/iam/auth-org/get', payload)}
  */
  '/iam/auth-org/get': {Req: {orgId: any}; Res: AuthOrgVO}

  /* 【组织管理】
  // 启用/禁用组织 | object:{orgId:组织ID,enable:bool,enableNotes:原因}
  export function iamAuthOrgEnable(payload: {orgId: any; enable: boolean; enableNotes: any}) {return http.post<Res<Record<string, any>>>('/iam/auth-org/enable', payload)}
  */
  '/iam/auth-org/enable': {Req: {orgId: any; enable: boolean; enableNotes: any}; Res: Record<string, any>}

  /* 【组织管理】
  // 删除组织 | object:{orgId:组织ID}
  export function iamAuthOrgDelete(payload: {orgId: any}) {return http.post<Res<Record<string, any>>>('/iam/auth-org/delete', payload)}
  */
  '/iam/auth-org/delete': {Req: {orgId: any}; Res: Record<string, any>}

  /* 【字典管理】
  // 新增/修改字典
  export function amsSysDicUpsert(payload: SysDicUpsertDTO) {return http.post<Res<string>>('/ams/sys-dic/upsert', payload)}
  */
  '/ams/sys-dic/upsert': {Req: SysDicUpsertDTO; Res: string}

  /* 【字典管理】
  // 新增/修改字典(批量)
  export function amsSysDicUpsertBatch(payload: SysDicUpsertDTO) {return http.post<Res<string>>('/ams/sys-dic/upsert-batch', payload)}
  */
  '/ams/sys-dic/upsert-batch': {Req: SysDicUpsertDTO; Res: string}

  /* 【字典管理】
  // 字典列表
  export function amsSysDicList(payload: SysDicListDTO) {return http.post<Res<SysDicVO[]>>('/ams/sys-dic/list', payload)}
  */
  '/ams/sys-dic/list': {Req: SysDicListDTO; Res: SysDicVO[]}

  /* 【字典管理】
  // 字典详情 | object:{dicId:字典ID}
  export function amsSysDicGet(payload: {dicId: any}) {return http.post<Res<SysDicVO>>('/ams/sys-dic/get', payload)}
  */
  '/ams/sys-dic/get': {Req: {dicId: any}; Res: SysDicVO}

  /* 【字典管理】
  // 启用/禁用字典 | object:{dicId:字典ID,enable:bool}
  export function amsSysDicEnable(payload: {dicId: any; enable: boolean}) {return http.post<Res<Record<string, any>>>('/ams/sys-dic/enable', payload)}
  */
  '/ams/sys-dic/enable': {Req: {dicId: any; enable: boolean}; Res: Record<string, any>}

  /* 【字典管理】
  // 删除字典 | object:{dicId:字典ID}
  export function amsSysDicDelete(payload: {dicId: any}) {return http.post<Res<Record<string, any>>>('/ams/sys-dic/delete', payload)}
  */
  '/ams/sys-dic/delete': {Req: {dicId: any}; Res: Record<string, any>}

  /* 【通用相关】
  // 中文转拼音 | object:{key:中文}
  export function amsCommonFuncZhToPinyin(payload: {key: any}) {return http.post<Res<string>>('/ams/common/func/zh-to-pinyin', payload)}
  */
  '/ams/common/func/zh-to-pinyin': {Req: {key: any}; Res: string}

  /* 【通用相关】
  // 身份证判断男女 | object:{certNo:身份证}
  export function amsCommonFuncCertNoToGender(payload: {certNo: any}) {return http.post<Res<string>>('/ams/common/func/certNo-to-gender', payload)}
  */
  '/ams/common/func/certNo-to-gender': {Req: {certNo: any}; Res: string}

  /* 【通用相关】
  // 文件上传(type,file)
  export function amsCommonFileUpload() {return http.post<Res<FileModel>>('/ams/common/file/upload')}
  */
  '/ams/common/file/upload': {Res: FileModel}

  /* 【通用相关】
  // 文件上传(type,file,filename)
  export function amsCommonFileUploadBase64() {return http.post<Res<FileModel>>('/ams/common/file/upload-base64')}
  */
  '/ams/common/file/upload-base64': {Res: FileModel}

  /* 【通用相关】
  // 文件ID转文件Model,入参[id1,id2]
  export function amsCommonFileIdToPath() {return http.post<Res<FileModel[]>>('/ams/common/file/id-to-path')}
  */
  '/ams/common/file/id-to-path': {Res: FileModel[]}

  /* 【通用相关】
  // 码表元信息
  export function amsCommonDicMeta(payload: Record<string, any>) {return http.post<Res<Record<string, Record<string, any>>[]>>('/ams/common/dic/meta', payload)}
  */
  '/ams/common/dic/meta': {Req: Record<string, any>; Res: Record<string, Record<string, any>>[]}

  /* 【通用相关】
  // 树形码表 | object:{dicType:字典类型}
  export function amsCommonDicListTree(payload: {dicType: any}) {return http.post<Res<SysDicVO[]>>('/ams/common/dic/list-tree', payload)}
  */
  '/ams/common/dic/list-tree': {Req: {dicType: any}; Res: SysDicVO[]}

  /* 【通用相关】
  // 常规码表
  export function amsCommonDicListAll(payload: Record<string, any>) {return http.post<Res<Record<string, SysDicVO[]>>>('/ams/common/dic/list-all', payload)}
  */
  '/ams/common/dic/list-all': {Req: Record<string, any>; Res: Record<string, SysDicVO[]>}

  /* 【通用相关】
  // 省_市_区_商圈 | object:{pid:上级ID}
  export function amsCommonAreaList(payload: {pid: any}) {return http.post<Res<PairModel[]>>('/ams/common/area/list', payload)}
  */
  '/ams/common/area/list': {Req: {pid: any}; Res: PairModel[]}

  /* 【通用相关】
  // 根据城市查询区和街道(树) | object:{cityCode:城市CODE}
  export function amsCommonAreaCityInfo(payload: {cityCode: any}) {return http.post<Res<Record<string, TreeModel[]>>>('/ams/common/area/city-info', payload)}
  */
  '/ams/common/area/city-info': {Req: {cityCode: any}; Res: Record<string, TreeModel[]>}

  /* 【资产管理-商业管理】
  // 更新商铺
  export function amsAssetShopUpdate(payload: AssetShopUpsertDTO) {return http.post<Res<Record<string, any>>>('/ams/asset-shop/update', payload)}
  */
  '/ams/asset-shop/update': {Req: AssetShopUpsertDTO; Res: Record<string, any>}

  /* 【资产管理-商业管理】
  // 拆分商铺
  export function amsAssetShopSplit(payload: AssetShopSplitDTO) {return http.post<Res<string>>('/ams/asset-shop/split', payload)}
  */
  '/ams/asset-shop/split': {Req: AssetShopSplitDTO; Res: string}

  /* 【资产管理-商业管理】
  // 商铺列表
  export function amsAssetShopList(payload: AssetShopListDTO) {return http.post<Res<AssetShopVO[]>>('/ams/asset-shop/list', payload)}
  */
  '/ams/asset-shop/list': {Req: AssetShopListDTO; Res: AssetShopVO[]}

  /* 【资产管理-商业管理】
  // 商铺列表导出
  export function amsAssetShopListExport(payload: AssetShopListDTO) {return http.post<Res<>>('/ams/asset-shop/list-export', payload)}
  */
  '/ams/asset-shop/list-export': {Req: AssetShopListDTO}

  /* 【资产管理-商业管理】
  // 商铺列表导出(字段元数据)
  export function amsAssetShopListExportMeta(payload: Record<string, any>) {return http.post<Res<PairModel[]>>('/ams/asset-shop/list-export-meta', payload)}
  */
  '/ams/asset-shop/list-export-meta': {Req: Record<string, any>; Res: PairModel[]}

  /* 【资产管理-商业管理】
  // 新增商铺 | {shopList:[{商铺信息}]}
  export function amsAssetShopInsert(payload: AssetShopInsertDTO) {return http.post<Res<Record<string, any>>>('/ams/asset-shop/insert', payload)}
  */
  '/ams/asset-shop/insert': {Req: AssetShopInsertDTO; Res: Record<string, any>}

  /* 【资产管理-商业管理】
  // 导入步骤4: 导入商业 | object:{fid:文件ID,assetType:资产类型}
  export function amsAssetShopImportTemplate(payload: {fid: any; assetType: any}) {return http.post<Res<Record<string, any>>>('/ams/asset-shop/import-template', payload)}
  */
  '/ams/asset-shop/import-template': {Req: {fid: any; assetType: any}; Res: Record<string, any>}

  /* 【资产管理-商业管理】
  // 商铺详情
  export function amsAssetShopGet(payload: Record<string, any>) {return http.post<Res<AssetShopVO>>('/ams/asset-shop/get', payload)}
  */
  '/ams/asset-shop/get': {Req: Record<string, any>; Res: AssetShopVO}

  /* 【资产管理-商业管理】
  // 导入步骤1: 导出上传模板
  export function amsAssetShopExportTemplate(payload: Record<string, any>) {return http.post<Res<>>('/ams/asset-shop/export-template', payload)}
  */
  '/ams/asset-shop/export-template': {Req: Record<string, any>}

  /* 【资产管理-商业管理】
  // 启用/禁用商铺 | object:{shopId:住宅编码,enable:bool}
  export function amsAssetShopEnable(payload: {shopId: any; enable: boolean}) {return http.post<Res<Record<string, any>>>('/ams/asset-shop/enable', payload)}
  */
  '/ams/asset-shop/enable': {Req: {shopId: any; enable: boolean}; Res: Record<string, any>}

  /* 【资产管理-商业管理】
  // 删除商铺
  export function amsAssetShopDelete(payload: Record<string, any>) {return http.post<Res<Record<string, any>>>('/ams/asset-shop/delete', payload)}
  */
  '/ams/asset-shop/delete': {Req: Record<string, any>; Res: Record<string, any>}

  /* 【资产管理-商业管理】
  // 导入步骤2: 校验上传模板 | object:{fid:文件ID}
  export function amsAssetShopCheckTemplate(payload: {fid: any}) {return http.post<Res<UserTemplateImportCheckVO>>('/ams/asset-shop/check-template', payload)}
  */
  '/ams/asset-shop/check-template': {Req: {fid: any}; Res: UserTemplateImportCheckVO}

  /* 【资产管理-商业管理】
  // 导入步骤3: 下载校验后的模板 | object:{fid:文件ID}
  export function amsAssetShopCheckTemplateExport(payload: {fid: any}) {return http.post<Res<>>('/ams/asset-shop/check-template-export', payload)}
  */
  '/ams/asset-shop/check-template-export': {Req: {fid: any}}

  /* 【资产管理-住宅管理】
  // 新增/更新住宅
  export function amsAssetRoomUpdate(payload: AssetRoomUpsertDTO) {return http.post<Res<Record<string, any>>>('/ams/asset-room/update', payload)}
  */
  '/ams/asset-room/update': {Req: AssetRoomUpsertDTO; Res: Record<string, any>}

  /* 【资产管理-住宅管理】
  // 住宅列表
  export function amsAssetRoomList(payload: AssetRoomListDTO) {return http.post<Res<AssetRoomVO[]>>('/ams/asset-room/list', payload)}
  */
  '/ams/asset-room/list': {Req: AssetRoomListDTO; Res: AssetRoomVO[]}

  /* 【资产管理-住宅管理】
  // 住宅列表导出
  export function amsAssetRoomListExport(payload: AssetRoomListDTO) {return http.post<Res<>>('/ams/asset-room/list-export', payload)}
  */
  '/ams/asset-room/list-export': {Req: AssetRoomListDTO}

  /* 【资产管理-住宅管理】
  // 住宅列表导出(字段元数据)
  export function amsAssetRoomListExportMeta(payload: Record<string, any>) {return http.post<Res<PairModel[]>>('/ams/asset-room/list-export-meta', payload)}
  */
  '/ams/asset-room/list-export-meta': {Req: Record<string, any>; Res: PairModel[]}

  /* 【资产管理-住宅管理】
  // 新增/更新住宅 | {roomList:[{住宅信息}]}
  export function amsAssetRoomInsert(payload: AssetRoomInsertDTO) {return http.post<Res<Record<string, any>>>('/ams/asset-room/insert', payload)}
  */
  '/ams/asset-room/insert': {Req: AssetRoomInsertDTO; Res: Record<string, any>}

  /* 【资产管理-住宅管理】
  // 导入步骤4: 导入房间 | object:{fid:文件ID,assetType:资产类型}
  export function amsAssetRoomImportTemplate(payload: {fid: any; assetType: any}) {return http.post<Res<Record<string, any>>>('/ams/asset-room/import-template', payload)}
  */
  '/ams/asset-room/import-template': {Req: {fid: any; assetType: any}; Res: Record<string, any>}

  /* 【资产管理-住宅管理】
  // 住宅详情
  export function amsAssetRoomGet(payload: Record<string, any>) {return http.post<Res<AssetRoomVO>>('/ams/asset-room/get', payload)}
  */
  '/ams/asset-room/get': {Req: Record<string, any>; Res: AssetRoomVO}

  /* 【资产管理-住宅管理】
  // 导入步骤1: 导出上传模板
  export function amsAssetRoomExportTemplate(payload: Record<string, any>) {return http.post<Res<>>('/ams/asset-room/export-template', payload)}
  */
  '/ams/asset-room/export-template': {Req: Record<string, any>}

  /* 【资产管理-住宅管理】
  // 启用/禁用住宅 | object:{roomId:住宅编码,enable:bool}
  export function amsAssetRoomEnable(payload: {roomId: any; enable: boolean}) {return http.post<Res<Record<string, any>>>('/ams/asset-room/enable', payload)}
  */
  '/ams/asset-room/enable': {Req: {roomId: any; enable: boolean}; Res: Record<string, any>}

  /* 【资产管理-住宅管理】
  // 删除住宅
  export function amsAssetRoomDelete(payload: Record<string, any>) {return http.post<Res<Record<string, any>>>('/ams/asset-room/delete', payload)}
  */
  '/ams/asset-room/delete': {Req: Record<string, any>; Res: Record<string, any>}

  /* 【资产管理-住宅管理】
  // 导入步骤2: 校验上传模板 | object:{fid:文件ID}
  export function amsAssetRoomCheckTemplate(payload: {fid: any}) {return http.post<Res<UserTemplateImportCheckVO>>('/ams/asset-room/check-template', payload)}
  */
  '/ams/asset-room/check-template': {Req: {fid: any}; Res: UserTemplateImportCheckVO}

  /* 【资产管理-住宅管理】
  // 导入步骤3: 下载校验后的模板 | object:{fid:文件ID}
  export function amsAssetRoomCheckTemplateExport(payload: {fid: any}) {return http.post<Res<>>('/ams/asset-room/check-template-export', payload)}
  */
  '/ams/asset-room/check-template-export': {Req: {fid: any}}

  /* 【资产管理-空间点位资源管理】
  // 更新空间点位资源
  export function amsAssetResourceUpdate(payload: AssetResourceUpsertDTO) {return http.post<Res<Record<string, any>>>('/ams/asset-resource/update', payload)}
  */
  '/ams/asset-resource/update': {Req: AssetResourceUpsertDTO; Res: Record<string, any>}

  /* 【资产管理-空间点位资源管理】
  // 根据空间点位资源楼层查询商铺号/房间号
  export function amsAssetResourceSelectLocationId(payload: AssetLocationIdListDTO) {return http.post<Res<Record<string, any>>>('/ams/asset-resource/select-location-id', payload)}
  */
  '/ams/asset-resource/select-location-id': {Req: AssetLocationIdListDTO; Res: Record<string, any>}

  /* 【资产管理-空间点位资源管理】
  // 空间点位资源列表
  export function amsAssetResourceList(payload: AssetResourceListDTO) {return http.post<Res<AssetResourceVO[]>>('/ams/asset-resource/list', payload)}
  */
  '/ams/asset-resource/list': {Req: AssetResourceListDTO; Res: AssetResourceVO[]}

  /* 【资产管理-空间点位资源管理】
  // 空间点位资源列表导出
  export function amsAssetResourceListExport(payload: AssetResourceListDTO) {return http.post<Res<>>('/ams/asset-resource/list-export', payload)}
  */
  '/ams/asset-resource/list-export': {Req: AssetResourceListDTO}

  /* 【资产管理-空间点位资源管理】
  // 空间点位资源列表导出(字段元数据)
  export function amsAssetResourceListExportMeta(payload: Record<string, any>) {return http.post<Res<PairModel[]>>('/ams/asset-resource/list-export-meta', payload)}
  */
  '/ams/asset-resource/list-export-meta': {Req: Record<string, any>; Res: PairModel[]}

  /* 【资产管理-空间点位资源管理】
  // 新增空间点位资源
  export function amsAssetResourceInsert(payload: AssetResourceInsertDTO) {return http.post<Res<Record<string, any>>>('/ams/asset-resource/insert', payload)}
  */
  '/ams/asset-resource/insert': {Req: AssetResourceInsertDTO; Res: Record<string, any>}

  /* 【资产管理-空间点位资源管理】
  // 导入步骤4: 导入空间点位资源 | object:{fid:文件ID,assetType:资产类型}
  export function amsAssetResourceImportTemplate(payload: {fid: any; assetType: any}) {return http.post<Res<Record<string, any>>>('/ams/asset-resource/import-template', payload)}
  */
  '/ams/asset-resource/import-template': {Req: {fid: any; assetType: any}; Res: Record<string, any>}

  /* 【资产管理-空间点位资源管理】
  // 空间点位资源详情
  export function amsAssetResourceGet(payload: Record<string, any>) {return http.post<Res<AssetResourceVO>>('/ams/asset-resource/get', payload)}
  */
  '/ams/asset-resource/get': {Req: Record<string, any>; Res: AssetResourceVO}

  /* 【资产管理-空间点位资源管理】
  // 生成空间点位资源编码
  export function amsAssetResourceGenerateResourceId(payload: AssetResourceIdGenerateDTO) {return http.post<Res<string>>('/ams/asset-resource/generate-resource-id', payload)}
  */
  '/ams/asset-resource/generate-resource-id': {Req: AssetResourceIdGenerateDTO; Res: string}

  /* 【资产管理-空间点位资源管理】
  // 导入步骤1: 导出空间点位资源上传模板
  export function amsAssetResourceExportTemplate(payload: Record<string, any>) {return http.post<Res<>>('/ams/asset-resource/export-template', payload)}
  */
  '/ams/asset-resource/export-template': {Req: Record<string, any>}

  /* 【资产管理-空间点位资源管理】
  // 启用/禁用空间点位资源 | object:{resourceId:空间点位资源编码,enable:bool}
  export function amsAssetResourceEnable(payload: {resourceId: any; enable: boolean}) {return http.post<Res<Record<string, any>>>('/ams/asset-resource/enable', payload)}
  */
  '/ams/asset-resource/enable': {Req: {resourceId: any; enable: boolean}; Res: Record<string, any>}

  /* 【资产管理-空间点位资源管理】
  // 删除空间点位资源
  export function amsAssetResourceDelete(payload: Record<string, any>) {return http.post<Res<Record<string, any>>>('/ams/asset-resource/delete', payload)}
  */
  '/ams/asset-resource/delete': {Req: Record<string, any>; Res: Record<string, any>}

  /* 【资产管理-空间点位资源管理】
  // 导入步骤2: 校验空间点位资源上传模板 | object:{fid:文件ID}
  export function amsAssetResourceCheckTemplate(payload: {fid: any}) {return http.post<Res<UserTemplateImportCheckVO>>('/ams/asset-resource/check-template', payload)}
  */
  '/ams/asset-resource/check-template': {Req: {fid: any}; Res: UserTemplateImportCheckVO}

  /* 【资产管理-空间点位资源管理】
  // 导入步骤3: 下载空间点位资源校验后的模板 | object:{fid:文件ID`}
  export function amsAssetResourceCheckTemplateExport(payload: {fid: any}) {return http.post<Res<>>('/ams/asset-resource/check-template-export', payload)}
  */
  '/ams/asset-resource/check-template-export': {Req: {fid: any}}

  /* 【资产管理-空间点位资源管理】
  // 批量启用/禁用空间点位资源
  export function amsAssetResourceBatchEnable(payload: AssetResourceBatchEnableDTO) {return http.post<Res<Record<string, any>>>('/ams/asset-resource/batch-enable', payload)}
  */
  '/ams/asset-resource/batch-enable': {Req: AssetResourceBatchEnableDTO; Res: Record<string, any>}

  /* 【资产管理-项目管理】
  // 更新项目
  export function amsAssetProjectUpdate(payload: AssetProjectUpsertDTO) {return http.post<Res<Record<string, any>>>('/ams/asset-project/update', payload)}
  */
  '/ams/asset-project/update': {Req: AssetProjectUpsertDTO; Res: Record<string, any>}

  /* 【资产管理-项目管理】
  // 项目列表
  export function amsAssetProjectList(payload: AssetProjectListDTO) {return http.post<Res<AssetProjectVO[]>>('/ams/asset-project/list', payload)}
  */
  '/ams/asset-project/list': {Req: AssetProjectListDTO; Res: AssetProjectVO[]}

  /* 【资产管理-项目管理】
  // 项目列表导出
  export function amsAssetProjectListExport(payload: AssetProjectListDTO) {return http.post<Res<>>('/ams/asset-project/list-export', payload)}
  */
  '/ams/asset-project/list-export': {Req: AssetProjectListDTO}

  /* 【资产管理-项目管理】
  // 项目列表导出(字段元数据)
  export function amsAssetProjectListExportMeta(payload: Record<string, any>) {return http.post<Res<PairModel[]>>('/ams/asset-project/list-export-meta', payload)}
  */
  '/ams/asset-project/list-export-meta': {Req: Record<string, any>; Res: PairModel[]}

  /* 【资产管理-项目管理】
  // 新增项目
  export function amsAssetProjectInsert(payload: AssetProjectUpsertDTO) {return http.post<Res<Record<string, any>>>('/ams/asset-project/insert', payload)}
  */
  '/ams/asset-project/insert': {Req: AssetProjectUpsertDTO; Res: Record<string, any>}

  /* 【资产管理-项目管理】
  // 导入步骤4: 导入项目 | object:{fid:文件ID}
  export function amsAssetProjectImportTemplate(payload: {fid: any}) {return http.post<Res<Record<string, any>>>('/ams/asset-project/import-template', payload)}
  */
  '/ams/asset-project/import-template': {Req: {fid: any}; Res: Record<string, any>}

  /* 【资产管理-项目管理】
  // 项目详情
  export function amsAssetProjectGet(payload: Record<string, any>) {return http.post<Res<AssetProjectVO>>('/ams/asset-project/get', payload)}
  */
  '/ams/asset-project/get': {Req: Record<string, any>; Res: AssetProjectVO}

  /* 【资产管理-项目管理】
  // 生成项目编码
  export function amsAssetProjectGenerateProjectId() {return http.post<Res<string>>('/ams/asset-project/generate-project-id')}
  */
  '/ams/asset-project/generate-project-id': {Res: string}

  /* 【资产管理-项目管理】
  // 导入步骤1: 导出上传模板
  export function amsAssetProjectExportTemplate(payload: Record<string, any>) {return http.post<Res<>>('/ams/asset-project/export-template', payload)}
  */
  '/ams/asset-project/export-template': {Req: Record<string, any>}

  /* 【资产管理-项目管理】
  // 启用/禁用项目 | object:{projectId:项目编码,enable:bool}
  export function amsAssetProjectEnable(payload: {projectId: any; enable: boolean}) {return http.post<Res<Record<string, any>>>('/ams/asset-project/enable', payload)}
  */
  '/ams/asset-project/enable': {Req: {projectId: any; enable: boolean}; Res: Record<string, any>}

  /* 【资产管理-项目管理】
  // 删除项目
  export function amsAssetProjectDelete(payload: Record<string, any>) {return http.post<Res<Record<string, any>>>('/ams/asset-project/delete', payload)}
  */
  '/ams/asset-project/delete': {Req: Record<string, any>; Res: Record<string, any>}

  /* 【资产管理-项目管理】
  // 导入步骤2: 校验上传模板 | object:{fid:文件ID}
  export function amsAssetProjectCheckTemplate(payload: {fid: any}) {return http.post<Res<UserTemplateImportCheckVO>>('/ams/asset-project/check-template', payload)}
  */
  '/ams/asset-project/check-template': {Req: {fid: any}; Res: UserTemplateImportCheckVO}

  /* 【资产管理-项目管理】
  // 导入步骤3: 下载校验后的模板 | object:{fid:文件ID}
  export function amsAssetProjectCheckTemplateExport(payload: {fid: any}) {return http.post<Res<>>('/ams/asset-project/check-template-export', payload)}
  */
  '/ams/asset-project/check-template-export': {Req: {fid: any}}

  /* 【资产管理-停车场管理】
  // 新增停车场
  export function amsAssetParkingUpsert(payload: AssetParkingUpsertDTO) {return http.post<Res<Record<string, any>>>('/ams/asset-parking/upsert', payload)}
  */
  '/ams/asset-parking/upsert': {Req: AssetParkingUpsertDTO; Res: Record<string, any>}

  /* 【资产管理-停车场管理】
  // 更新停车场
  export function amsAssetParkingUpdate(payload: AssetParkingUpsertDTO) {return http.post<Res<Record<string, any>>>('/ams/asset-parking/update', payload)}
  */
  '/ams/asset-parking/update': {Req: AssetParkingUpsertDTO; Res: Record<string, any>}

  /* 【资产管理-停车场管理】
  // 根据停车场id查询停车场区域 | object:{parkingId:停车场编码}
  export function amsAssetParkingSelectParkingRegion(payload: {parkingId: any}) {return http.post<Res<AssetParkingRegionVO[]>>('/ams/asset-parking/select-parking-region', payload)}
  */
  '/ams/asset-parking/select-parking-region': {Req: {parkingId: any}; Res: AssetParkingRegionVO[]}

  /* 【资产管理-停车场管理】
  // 停车场列表
  export function amsAssetParkingList(payload: AssetParkingListDTO) {return http.post<Res<AssetParkingVO[]>>('/ams/asset-parking/list', payload)}
  */
  '/ams/asset-parking/list': {Req: AssetParkingListDTO; Res: AssetParkingVO[]}

  /* 【资产管理-停车场管理】
  // 停车场列表导出
  export function amsAssetParkingListExport(payload: AssetParkingListDTO) {return http.post<Res<>>('/ams/asset-parking/list-export', payload)}
  */
  '/ams/asset-parking/list-export': {Req: AssetParkingListDTO}

  /* 【资产管理-停车场管理】
  // 停车场列表导出(字段元数据)
  export function amsAssetParkingListExportMeta(payload: Record<string, any>) {return http.post<Res<PairModel[]>>('/ams/asset-parking/list-export-meta', payload)}
  */
  '/ams/asset-parking/list-export-meta': {Req: Record<string, any>; Res: PairModel[]}

  /* 【资产管理-停车场管理】
  // 导入步骤4: 导入停车场 | object:{fid:文件ID}
  export function amsAssetParkingImportTemplate(payload: {fid: any}) {return http.post<Res<Record<string, any>>>('/ams/asset-parking/import-template', payload)}
  */
  '/ams/asset-parking/import-template': {Req: {fid: any}; Res: Record<string, any>}

  /* 【资产管理-停车场管理】
  // 停车场详情 | object:{parkingId:停车场编码}
  export function amsAssetParkingGet(payload: {parkingId: any}) {return http.post<Res<AssetParkingVO>>('/ams/asset-parking/get', payload)}
  */
  '/ams/asset-parking/get': {Req: {parkingId: any}; Res: AssetParkingVO}

  /* 【资产管理-停车场管理】
  // 生成停车场编码 | object:{projectId:项目编码}
  export function amsAssetParkingGenerateParkingId(payload: {projectId: any}) {return http.post<Res<string>>('/ams/asset-parking/generate-parking-id', payload)}
  */
  '/ams/asset-parking/generate-parking-id': {Req: {projectId: any}; Res: string}

  /* 【资产管理-停车场管理】
  // 导入步骤1: 导出上传模板
  export function amsAssetParkingExportTemplate(payload: Record<string, any>) {return http.post<Res<>>('/ams/asset-parking/export-template', payload)}
  */
  '/ams/asset-parking/export-template': {Req: Record<string, any>}

  /* 【资产管理-停车场管理】
  // 启用/禁用停车场 | object:{parkingId:停车场编码,enable:bool}
  export function amsAssetParkingEnable(payload: {parkingId: any; enable: boolean}) {return http.post<Res<Record<string, any>>>('/ams/asset-parking/enable', payload)}
  */
  '/ams/asset-parking/enable': {Req: {parkingId: any; enable: boolean}; Res: Record<string, any>}

  /* 【资产管理-停车场管理】
  // 删除停车场 | object:{parkingId:停车场编码}
  export function amsAssetParkingDelete(payload: {parkingId: any}) {return http.post<Res<Record<string, any>>>('/ams/asset-parking/delete', payload)}
  */
  '/ams/asset-parking/delete': {Req: {parkingId: any}; Res: Record<string, any>}

  /* 【资产管理-停车场管理】
  // 导入步骤2: 校验上传模板 | object:{fid:文件ID}
  export function amsAssetParkingCheckTemplate(payload: {fid: any}) {return http.post<Res<UserTemplateImportCheckVO>>('/ams/asset-parking/check-template', payload)}
  */
  '/ams/asset-parking/check-template': {Req: {fid: any}; Res: UserTemplateImportCheckVO}

  /* 【资产管理-停车场管理】
  // 导入步骤3: 下载校验后的模板 | object:{fid:文件ID}
  export function amsAssetParkingCheckTemplateExport(payload: {fid: any}) {return http.post<Res<>>('/ams/asset-parking/check-template-export', payload)}
  */
  '/ams/asset-parking/check-template-export': {Req: {fid: any}}

  /* 【资产管理-停车场管理】
  // 校验停车场区域编码是否被使用 | object:{parkingSpaceRegionId:停车场区域编码l}
  export function amsAssetParkingCheckParkingSpaceRegionIsUse(payload: {parkingSpaceRegionId: any}) {return http.post<Res<Record<string, any>>>('/ams/asset-parking/check-parkingSpaceRegion-isUse', payload)}
  */
  '/ams/asset-parking/check-parkingSpaceRegion-isUse': {Req: {parkingSpaceRegionId: any}; Res: Record<string, any>}

  /* 【资产管理-停车位管理】
  // 更新停车位
  export function amsAssetParkingSpaceUpdate(payload: AssetParkingSpaceDTO) {return http.post<Res<Record<string, any>>>('/ams/asset-parking-space/update', payload)}
  */
  '/ams/asset-parking-space/update': {Req: AssetParkingSpaceDTO; Res: Record<string, any>}

  /* 【资产管理-停车位管理】
  // 停车位列表
  export function amsAssetParkingSpaceList(payload: AssetParkingSpaceListDTO) {return http.post<Res<AssetParkingSpaceVO[]>>('/ams/asset-parking-space/list', payload)}
  */
  '/ams/asset-parking-space/list': {Req: AssetParkingSpaceListDTO; Res: AssetParkingSpaceVO[]}

  /* 【资产管理-停车位管理】
  // 停车位列表导出
  export function amsAssetParkingSpaceListExport(payload: AssetParkingSpaceListDTO) {return http.post<Res<>>('/ams/asset-parking-space/list-export', payload)}
  */
  '/ams/asset-parking-space/list-export': {Req: AssetParkingSpaceListDTO}

  /* 【资产管理-停车位管理】
  // 停车位列表导出(字段元数据)
  export function amsAssetParkingSpaceListExportMeta(payload: Record<string, any>) {return http.post<Res<PairModel[]>>('/ams/asset-parking-space/list-export-meta', payload)}
  */
  '/ams/asset-parking-space/list-export-meta': {Req: Record<string, any>; Res: PairModel[]}

  /* 【资产管理-停车位管理】
  // 新增停车位
  export function amsAssetParkingSpaceInsert(payload: AssetParkingSpaceInsertDTO) {return http.post<Res<Record<string, any>>>('/ams/asset-parking-space/insert', payload)}
  */
  '/ams/asset-parking-space/insert': {Req: AssetParkingSpaceInsertDTO; Res: Record<string, any>}

  /* 【资产管理-停车位管理】
  // 导入步骤4: 导入停车位 | object:{fid:文件ID}
  export function amsAssetParkingSpaceImportTemplate(payload: {fid: any}) {return http.post<Res<Record<string, any>>>('/ams/asset-parking-space/import-template', payload)}
  */
  '/ams/asset-parking-space/import-template': {Req: {fid: any}; Res: Record<string, any>}

  /* 【资产管理-停车位管理】
  // 停车位详情
  export function amsAssetParkingSpaceGet(payload: Record<string, any>) {return http.post<Res<AssetParkingSpaceVO>>('/ams/asset-parking-space/get', payload)}
  */
  '/ams/asset-parking-space/get': {Req: Record<string, any>; Res: AssetParkingSpaceVO}

  /* 【资产管理-停车位管理】
  // 生成停车位编码 | object:{parkingRegionId:车位区域编码}
  export function amsAssetParkingSpaceGenerateParkingSpaceId(payload: {parkingRegionId: any}) {return http.post<Res<string>>('/ams/asset-parking-space/generate-parking-space-id', payload)}
  */
  '/ams/asset-parking-space/generate-parking-space-id': {Req: {parkingRegionId: any}; Res: string}

  /* 【资产管理-停车位管理】
  // 导入步骤1: 导出上传模板
  export function amsAssetParkingSpaceExportTemplate(payload: Record<string, any>) {return http.post<Res<>>('/ams/asset-parking-space/export-template', payload)}
  */
  '/ams/asset-parking-space/export-template': {Req: Record<string, any>}

  /* 【资产管理-停车位管理】
  // 删除停车位 | object:{parkingSpaceId:停车位编码}
  export function amsAssetParkingSpaceDelete(payload: {parkingSpaceId: any}) {return http.post<Res<Record<string, any>>>('/ams/asset-parking-space/delete', payload)}
  */
  '/ams/asset-parking-space/delete': {Req: {parkingSpaceId: any}; Res: Record<string, any>}

  /* 【资产管理-停车位管理】
  // 导入步骤2: 校验上传模板 | object:{fid:文件ID}
  export function amsAssetParkingSpaceCheckTemplate(payload: {fid: any}) {return http.post<Res<UserTemplateImportCheckVO>>('/ams/asset-parking-space/check-template', payload)}
  */
  '/ams/asset-parking-space/check-template': {Req: {fid: any}; Res: UserTemplateImportCheckVO}

  /* 【资产管理-停车位管理】
  // 导入步骤3: 下载校验后的模板 | object:{fid:文件ID}
  export function amsAssetParkingSpaceCheckTemplateExport(payload: {fid: any}) {return http.post<Res<>>('/ams/asset-parking-space/check-template-export', payload)}
  */
  '/ams/asset-parking-space/check-template-export': {Req: {fid: any}}

  /* 【资产管理-楼层管理】
  // 更新楼层
  export function amsAssetFloorUpdate(payload: AssetFloorDTO) {return http.post<Res<string>>('/ams/asset-floor/update', payload)}
  */
  '/ams/asset-floor/update': {Req: AssetFloorDTO; Res: string}

  /* 【资产管理-楼层管理】
  // 楼层列表
  export function amsAssetFloorList(payload: AssetFloorListDTO) {return http.post<Res<AssetFloorVO[]>>('/ams/asset-floor/list', payload)}
  */
  '/ams/asset-floor/list': {Req: AssetFloorListDTO; Res: AssetFloorVO[]}

  /* 【资产管理-楼层管理】
  // 新增楼层
  export function amsAssetFloorInsert(payload: AssetFloorDTO) {return http.post<Res<string>>('/ams/asset-floor/insert', payload)}
  */
  '/ams/asset-floor/insert': {Req: AssetFloorDTO; Res: string}

  /* 【资产管理-楼层管理】
  // 导入步骤4: 导入楼层 | object:{fid:文件ID,assetType:资产类型}
  export function amsAssetFloorImportTemplate(payload: {fid: any; assetType: any}) {return http.post<Res<Record<string, any>>>('/ams/asset-floor/import-template', payload)}
  */
  '/ams/asset-floor/import-template': {Req: {fid: any; assetType: any}; Res: Record<string, any>}

  /* 【资产管理-楼层管理】
  // 楼层详情
  export function amsAssetFloorGet(payload: Record<string, any>) {return http.post<Res<AssetFloorVO>>('/ams/asset-floor/get', payload)}
  */
  '/ams/asset-floor/get': {Req: Record<string, any>; Res: AssetFloorVO}

  /* 【资产管理-楼层管理】
  // 生成楼层编码 | object:{assetId:资产编码(楼栋或围合的编码)}
  export function amsAssetFloorGenerateFloorId(payload: {assetId: any}) {return http.post<Res<string>>('/ams/asset-floor/generate-floor-id', payload)}
  */
  '/ams/asset-floor/generate-floor-id': {Req: {assetId: any}; Res: string}

  /* 【资产管理-楼层管理】
  // 导入步骤1: 导出上传模板
  export function amsAssetFloorExportTemplate(payload: Record<string, any>) {return http.post<Res<>>('/ams/asset-floor/export-template', payload)}
  */
  '/ams/asset-floor/export-template': {Req: Record<string, any>}

  /* 【资产管理-楼层管理】
  // 围合楼层列表导出
  export function amsAssetFloorEnclosureListExport(payload: AssetFloorListDTO) {return http.post<Res<>>('/ams/asset-floor/enclosure-list-export', payload)}
  */
  '/ams/asset-floor/enclosure-list-export': {Req: AssetFloorListDTO}

  /* 【资产管理-楼层管理】
  // 围合楼层列表导出(字段元数据)
  export function amsAssetFloorEnclosureListExportMeta(payload: Record<string, any>) {return http.post<Res<PairModel[]>>('/ams/asset-floor/enclosure-list-export-meta', payload)}
  */
  '/ams/asset-floor/enclosure-list-export-meta': {Req: Record<string, any>; Res: PairModel[]}

  /* 【资产管理-楼层管理】
  // 启用/禁用楼层 | object:{floorId:楼层编码,enable:bool}
  export function amsAssetFloorEnable(payload: {floorId: any; enable: boolean}) {return http.post<Res<Record<string, any>>>('/ams/asset-floor/enable', payload)}
  */
  '/ams/asset-floor/enable': {Req: {floorId: any; enable: boolean}; Res: Record<string, any>}

  /* 【资产管理-楼层管理】
  // 删除楼层
  export function amsAssetFloorDelete(payload: Record<string, any>) {return http.post<Res<Record<string, any>>>('/ams/asset-floor/delete', payload)}
  */
  '/ams/asset-floor/delete': {Req: Record<string, any>; Res: Record<string, any>}

  /* 【资产管理-楼层管理】
  // 导入步骤2: 校验上传模板 | object:{fid:文件ID,assetType:资产类型}
  export function amsAssetFloorCheckTemplate(payload: {fid: any; assetType: any}) {return http.post<Res<UserTemplateImportCheckVO>>('/ams/asset-floor/check-template', payload)}
  */
  '/ams/asset-floor/check-template': {Req: {fid: any; assetType: any}; Res: UserTemplateImportCheckVO}

  /* 【资产管理-楼层管理】
  // 导入步骤3: 下载校验后的模板 | object:{fid:文件ID,assetType:资产类型}
  export function amsAssetFloorCheckTemplateExport(payload: {fid: any; assetType: any}) {return http.post<Res<>>('/ams/asset-floor/check-template-export', payload)}
  */
  '/ams/asset-floor/check-template-export': {Req: {fid: any; assetType: any}}

  /* 【资产管理-楼层管理】
  // 楼栋楼层列表导出
  export function amsAssetFloorBuildingListExport(payload: AssetFloorListDTO) {return http.post<Res<>>('/ams/asset-floor/building-list-export', payload)}
  */
  '/ams/asset-floor/building-list-export': {Req: AssetFloorListDTO}

  /* 【资产管理-楼层管理】
  // 楼栋楼层列表导出(字段元数据)
  export function amsAssetFloorBuildingListExportMeta(payload: Record<string, any>) {return http.post<Res<PairModel[]>>('/ams/asset-floor/building-list-export-meta', payload)}
  */
  '/ams/asset-floor/building-list-export-meta': {Req: Record<string, any>; Res: PairModel[]}

  /* 【资产管理-固定资产管理】
  // 更新固定资产
  export function amsAssetFixedUpdate(payload: AssetFixedUpsertDTO) {return http.post<Res<Record<string, any>>>('/ams/asset-fixed/update', payload)}
  */
  '/ams/asset-fixed/update': {Req: AssetFixedUpsertDTO; Res: Record<string, any>}

  /* 【资产管理-固定资产管理】
  // 固定资产列表
  export function amsAssetFixedList(payload: AssetFixedListDTO) {return http.post<Res<AssetFixedVO[]>>('/ams/asset-fixed/list', payload)}
  */
  '/ams/asset-fixed/list': {Req: AssetFixedListDTO; Res: AssetFixedVO[]}

  /* 【资产管理-固定资产管理】
  // 固定资产列表导出
  export function amsAssetFixedListExport(payload: AssetFixedListDTO) {return http.post<Res<>>('/ams/asset-fixed/list-export', payload)}
  */
  '/ams/asset-fixed/list-export': {Req: AssetFixedListDTO}

  /* 【资产管理-固定资产管理】
  // 固定资产列表导出(字段元数据)
  export function amsAssetFixedListExportMeta(payload: Record<string, any>) {return http.post<Res<PairModel[]>>('/ams/asset-fixed/list-export-meta', payload)}
  */
  '/ams/asset-fixed/list-export-meta': {Req: Record<string, any>; Res: PairModel[]}

  /* 【资产管理-固定资产管理】
  // 新增固定资产
  export function amsAssetFixedInsert(payload: AssetFixedUpsertDTO) {return http.post<Res<Record<string, any>>>('/ams/asset-fixed/insert', payload)}
  */
  '/ams/asset-fixed/insert': {Req: AssetFixedUpsertDTO; Res: Record<string, any>}

  /* 【资产管理-固定资产管理】
  // 导入步骤4: 导入固定资产 | object:{fid:文件ID}
  export function amsAssetFixedImportTemplate(payload: {fid: any}) {return http.post<Res<Record<string, any>>>('/ams/asset-fixed/import-template', payload)}
  */
  '/ams/asset-fixed/import-template': {Req: {fid: any}; Res: Record<string, any>}

  /* 【资产管理-固定资产管理】
  // 固定资产详情
  export function amsAssetFixedGet(payload: Record<string, any>) {return http.post<Res<AssetFixedVO>>('/ams/asset-fixed/get', payload)}
  */
  '/ams/asset-fixed/get': {Req: Record<string, any>; Res: AssetFixedVO}

  /* 【资产管理-固定资产管理】
  // 生成固定资产编码
  export function amsAssetFixedGenerateFixedId(payload: AssetFixedIdGenerateDTO) {return http.post<Res<string>>('/ams/asset-fixed/generate-fixed-id', payload)}
  */
  '/ams/asset-fixed/generate-fixed-id': {Req: AssetFixedIdGenerateDTO; Res: string}

  /* 【资产管理-固定资产管理】
  // 导入步骤1: 导出上传模板
  export function amsAssetFixedExportTemplate(payload: Record<string, any>) {return http.post<Res<>>('/ams/asset-fixed/export-template', payload)}
  */
  '/ams/asset-fixed/export-template': {Req: Record<string, any>}

  /* 【资产管理-固定资产管理】
  // 启用/禁用固定资产 | object:{fixedId:固定资产编码,enable:bool}
  export function amsAssetFixedEnable(payload: {fixedId: any; enable: boolean}) {return http.post<Res<Record<string, any>>>('/ams/asset-fixed/enable', payload)}
  */
  '/ams/asset-fixed/enable': {Req: {fixedId: any; enable: boolean}; Res: Record<string, any>}

  /* 【资产管理-固定资产管理】
  // 删除固定资产
  export function amsAssetFixedDelete(payload: Record<string, any>) {return http.post<Res<Record<string, any>>>('/ams/asset-fixed/delete', payload)}
  */
  '/ams/asset-fixed/delete': {Req: Record<string, any>; Res: Record<string, any>}

  /* 【资产管理-固定资产管理】
  // 导入步骤2: 校验上传模板 | object:{fid:文件ID}
  export function amsAssetFixedCheckTemplate(payload: {fid: any}) {return http.post<Res<UserTemplateImportCheckVO>>('/ams/asset-fixed/check-template', payload)}
  */
  '/ams/asset-fixed/check-template': {Req: {fid: any}; Res: UserTemplateImportCheckVO}

  /* 【资产管理-固定资产管理】
  // 导入步骤3: 下载校验后的模板 | object:{fid:文件ID}
  export function amsAssetFixedCheckTemplateExport(payload: {fid: any}) {return http.post<Res<>>('/ams/asset-fixed/check-template-export', payload)}
  */
  '/ams/asset-fixed/check-template-export': {Req: {fid: any}}

  /* 【资产管理-固定资产管理】
  // 批量维护质保信息
  export function amsAssetFixedBatchWarranty(payload: AssetFixedBatchWarrantyDTO) {return http.post<Res<Record<string, any>>>('/ams/asset-fixed/batch-warranty', payload)}
  */
  '/ams/asset-fixed/batch-warranty': {Req: AssetFixedBatchWarrantyDTO; Res: Record<string, any>}

  /* 【资产管理-固定资产管理】
  // 批量更新固定资产
  export function amsAssetFixedBatchUpdate(payload: AssetFixedBatchUpdateDTO) {return http.post<Res<Record<string, any>>>('/ams/asset-fixed/batch-update', payload)}
  */
  '/ams/asset-fixed/batch-update': {Req: AssetFixedBatchUpdateDTO; Res: Record<string, any>}

  /* 【资产管理-固定资产管理】
  // 批量启用/禁用固定资产
  export function amsAssetFixedBatchEnable(payload: AssetFixedBatchEnableDTO) {return http.post<Res<Record<string, any>>>('/ams/asset-fixed/batch-enable', payload)}
  */
  '/ams/asset-fixed/batch-enable': {Req: AssetFixedBatchEnableDTO; Res: Record<string, any>}

  /* 【资产管理-围合管理】
  // 更新围合
  export function amsAssetEnclosureUpdate(payload: AssetEnclosureUpdateDTO) {return http.post<Res<Record<string, any>>>('/ams/asset-enclosure/update', payload)}
  */
  '/ams/asset-enclosure/update': {Req: AssetEnclosureUpdateDTO; Res: Record<string, any>}

  /* 【资产管理-围合管理】
  // 围合列表
  export function amsAssetEnclosureList(payload: AssetEnclosureListDTO) {return http.post<Res<AssetEnclosureVO[]>>('/ams/asset-enclosure/list', payload)}
  */
  '/ams/asset-enclosure/list': {Req: AssetEnclosureListDTO; Res: AssetEnclosureVO[]}

  /* 【资产管理-围合管理】
  // 围合列表导出
  export function amsAssetEnclosureListExport(payload: AssetEnclosureListDTO) {return http.post<Res<>>('/ams/asset-enclosure/list-export', payload)}
  */
  '/ams/asset-enclosure/list-export': {Req: AssetEnclosureListDTO}

  /* 【资产管理-围合管理】
  // 围合列表导出(字段元数据)
  export function amsAssetEnclosureListExportMeta(payload: Record<string, any>) {return http.post<Res<PairModel[]>>('/ams/asset-enclosure/list-export-meta', payload)}
  */
  '/ams/asset-enclosure/list-export-meta': {Req: Record<string, any>; Res: PairModel[]}

  /* 【资产管理-围合管理】
  // 新增围合
  export function amsAssetEnclosureInsert(payload: AssetEnclosureInsertDTO) {return http.post<Res<Record<string, any>>>('/ams/asset-enclosure/insert', payload)}
  */
  '/ams/asset-enclosure/insert': {Req: AssetEnclosureInsertDTO; Res: Record<string, any>}

  /* 【资产管理-围合管理】
  // 导入步骤4: 导入围合 | object:{fid:文件ID}
  export function amsAssetEnclosureImportTemplate(payload: {fid: any}) {return http.post<Res<Record<string, any>>>('/ams/asset-enclosure/import-template', payload)}
  */
  '/ams/asset-enclosure/import-template': {Req: {fid: any}; Res: Record<string, any>}

  /* 【资产管理-围合管理】
  // 围合详情
  export function amsAssetEnclosureGet(payload: Record<string, any>) {return http.post<Res<AssetEnclosureVO>>('/ams/asset-enclosure/get', payload)}
  */
  '/ams/asset-enclosure/get': {Req: Record<string, any>; Res: AssetEnclosureVO}

  /* 【资产管理-围合管理】
  // 生成围合编码
  export function amsAssetEnclosureGenerateEnclosureId(payload: Record<string, any>) {return http.post<Res<string>>('/ams/asset-enclosure/generate-enclosure-id', payload)}
  */
  '/ams/asset-enclosure/generate-enclosure-id': {Req: Record<string, any>; Res: string}

  /* 【资产管理-围合管理】
  // 导入步骤1: 导出上传模板
  export function amsAssetEnclosureExportTemplate(payload: Record<string, any>) {return http.post<Res<>>('/ams/asset-enclosure/export-template', payload)}
  */
  '/ams/asset-enclosure/export-template': {Req: Record<string, any>}

  /* 【资产管理-围合管理】
  // 启用/禁用合围 | object:{enclosureId:围合编码,enable:bool}
  export function amsAssetEnclosureEnable(payload: {enclosureId: any; enable: boolean}) {return http.post<Res<Record<string, any>>>('/ams/asset-enclosure/enable', payload)}
  */
  '/ams/asset-enclosure/enable': {Req: {enclosureId: any; enable: boolean}; Res: Record<string, any>}

  /* 【资产管理-围合管理】
  // 删除围合
  export function amsAssetEnclosureDelete(payload: Record<string, any>) {return http.post<Res<Record<string, any>>>('/ams/asset-enclosure/delete', payload)}
  */
  '/ams/asset-enclosure/delete': {Req: Record<string, any>; Res: Record<string, any>}

  /* 【资产管理-围合管理】
  // 导入步骤2: 校验上传模板 | object:{fid:文件ID}
  export function amsAssetEnclosureCheckTemplate(payload: {fid: any}) {return http.post<Res<UserTemplateImportCheckVO>>('/ams/asset-enclosure/check-template', payload)}
  */
  '/ams/asset-enclosure/check-template': {Req: {fid: any}; Res: UserTemplateImportCheckVO}

  /* 【资产管理-围合管理】
  // 导入步骤3: 下载校验后的模板 | object:{fid:文件ID}
  export function amsAssetEnclosureCheckTemplateExport(payload: {fid: any}) {return http.post<Res<>>('/ams/asset-enclosure/check-template-export', payload)}
  */
  '/ams/asset-enclosure/check-template-export': {Req: {fid: any}}

  /* 【资产管理-楼栋管理】
  // 更新楼栋
  export function amsAssetBuildingUpdate(payload: AssetBuildingUpdateDTO) {return http.post<Res<Record<string, any>>>('/ams/asset-building/update', payload)}
  */
  '/ams/asset-building/update': {Req: AssetBuildingUpdateDTO; Res: Record<string, any>}

  /* 【资产管理-楼栋管理】
  // 根据项目id查询楼栋&围合
  export function amsAssetBuildingSelectBuildingEnclosure(payload: Record<string, any>) {return http.post<Res<Record<string, any>>>('/ams/asset-building/select-building-enclosure', payload)}
  */
  '/ams/asset-building/select-building-enclosure': {Req: Record<string, any>; Res: Record<string, any>}

  /* 【资产管理-楼栋管理】
  // 楼栋列表
  export function amsAssetBuildingList(payload: AssetBuildingListDTO) {return http.post<Res<AssetBuildingVO[]>>('/ams/asset-building/list', payload)}
  */
  '/ams/asset-building/list': {Req: AssetBuildingListDTO; Res: AssetBuildingVO[]}

  /* 【资产管理-楼栋管理】
  // 楼栋列表导出
  export function amsAssetBuildingListExport(payload: AssetBuildingListDTO) {return http.post<Res<>>('/ams/asset-building/list-export', payload)}
  */
  '/ams/asset-building/list-export': {Req: AssetBuildingListDTO}

  /* 【资产管理-楼栋管理】
  // 楼栋列表导出(字段元数据)
  export function amsAssetBuildingListExportMeta(payload: Record<string, any>) {return http.post<Res<PairModel[]>>('/ams/asset-building/list-export-meta', payload)}
  */
  '/ams/asset-building/list-export-meta': {Req: Record<string, any>; Res: PairModel[]}

  /* 【资产管理-楼栋管理】
  // 新增楼栋
  export function amsAssetBuildingInsert(payload: AssetBuildingInsertDTO) {return http.post<Res<Record<string, any>>>('/ams/asset-building/insert', payload)}
  */
  '/ams/asset-building/insert': {Req: AssetBuildingInsertDTO; Res: Record<string, any>}

  /* 【资产管理-楼栋管理】
  // 导入步骤4: 导入楼栋 | object:{fid:文件ID}
  export function amsAssetBuildingImportTemplate(payload: {fid: any}) {return http.post<Res<Record<string, any>>>('/ams/asset-building/import-template', payload)}
  */
  '/ams/asset-building/import-template': {Req: {fid: any}; Res: Record<string, any>}

  /* 【资产管理-楼栋管理】
  // 楼栋详情
  export function amsAssetBuildingGet(payload: Record<string, any>) {return http.post<Res<AssetBuildingVO>>('/ams/asset-building/get', payload)}
  */
  '/ams/asset-building/get': {Req: Record<string, any>; Res: AssetBuildingVO}

  /* 【资产管理-楼栋管理】
  // 生成楼栋编码
  export function amsAssetBuildingGenerateBuildingId(payload: Record<string, any>) {return http.post<Res<string>>('/ams/asset-building/generate-building-id', payload)}
  */
  '/ams/asset-building/generate-building-id': {Req: Record<string, any>; Res: string}

  /* 【资产管理-楼栋管理】
  // 导入步骤1: 导出上传模板
  export function amsAssetBuildingExportTemplate(payload: Record<string, any>) {return http.post<Res<>>('/ams/asset-building/export-template', payload)}
  */
  '/ams/asset-building/export-template': {Req: Record<string, any>}

  /* 【资产管理-楼栋管理】
  // 启用/禁用楼栋 | object:{buildingId:楼栋编码,enable:bool}
  export function amsAssetBuildingEnable(payload: {buildingId: any; enable: boolean}) {return http.post<Res<Record<string, any>>>('/ams/asset-building/enable', payload)}
  */
  '/ams/asset-building/enable': {Req: {buildingId: any; enable: boolean}; Res: Record<string, any>}

  /* 【资产管理-楼栋管理】
  // 删除楼栋
  export function amsAssetBuildingDelete(payload: Record<string, any>) {return http.post<Res<Record<string, any>>>('/ams/asset-building/delete', payload)}
  */
  '/ams/asset-building/delete': {Req: Record<string, any>; Res: Record<string, any>}

  /* 【资产管理-楼栋管理】
  // 导入步骤2: 校验上传模板 | object:{fid:文件ID}
  export function amsAssetBuildingCheckTemplate(payload: {fid: any}) {return http.post<Res<UserTemplateImportCheckVO>>('/ams/asset-building/check-template', payload)}
  */
  '/ams/asset-building/check-template': {Req: {fid: any}; Res: UserTemplateImportCheckVO}

  /* 【资产管理-楼栋管理】
  // 导入步骤3: 下载校验后的模板 | object:{fid:文件ID}
  export function amsAssetBuildingCheckTemplateExport(payload: {fid: any}) {return http.post<Res<>>('/ams/asset-building/check-template-export', payload)}
  */
  '/ams/asset-building/check-template-export': {Req: {fid: any}}

  /* 【物业-SOP模板管理】
  // 移动SOP到目标分组 | object:{sopId:SOP ID,targetGroupId:目标分组ID}
  export function pmsPmsSopMove(payload: {sopId: any; targetGroupId: any}) {return http.post<Res<Record<string, any>>>('/pms/pms/sop/move', payload)}
  */
  '/pms/pms/sop/move': {Req: {sopId: any; targetGroupId: any}; Res: Record<string, any>}

  /* 【物业-SOP模板管理】
  // SOP模板列表（搜索）
  export function pmsPmsSopList(payload: PmsSopTemplateListDTO) {return http.post<Res<PmsSopTemplateVO[]>>('/pms/pms/sop/list', payload)}
  */
  '/pms/pms/sop/list': {Req: PmsSopTemplateListDTO; Res: PmsSopTemplateVO[]}

  /* 【物业-SOP模板管理】
  // 新建SOP模板
  export function pmsPmsSopInsert(payload: PmsSopTemplateInsertDTO) {return http.post<Res<string>>('/pms/pms/sop/insert', payload)}
  */
  '/pms/pms/sop/insert': {Req: PmsSopTemplateInsertDTO; Res: string}

  /* 【物业-SOP模板管理】
  // 批量删除SOP模板 | object:{sopIds:[SOP ID列表]}
  export function pmsPmsSopDelete(payload: {sopIds: any}) {return http.post<Res<Record<string, any>>>('/pms/pms/sop/delete', payload)}
  */
  '/pms/pms/sop/delete': {Req: {sopIds: any}; Res: Record<string, any>}

  /* 【物业-SOP模板管理】
  // 批量复制SOP（深拷贝） | object:{sopIds:[SOP ID列表],targetGroupId:目标分组ID}
  export function pmsPmsSopCopy(payload: {sopIds: any; targetGroupId: any}) {return http.post<Res<string[]>>('/pms/pms/sop/copy', payload)}
  */
  '/pms/pms/sop/copy': {Req: {sopIds: any; targetGroupId: any}; Res: string[]}

  /* 【物业-SOP步骤管理】
  // 编辑步骤
  export function pmsPmsSopStepUpdate(payload: PmsSopStepUpdateDTO) {return http.post<Res<PmsSopStepVO>>('/pms/pms/sop-step/update', payload)}
  */
  '/pms/pms/sop-step/update': {Req: PmsSopStepUpdateDTO; Res: PmsSopStepVO}

  /* 【物业-SOP步骤管理】
  // 步骤排序 | object:{stepIds:[步骤ID有序列表]}
  export function pmsPmsSopStepSort(payload: {stepIds: any}) {return http.post<Res<Record<string, any>>>('/pms/pms/sop-step/sort', payload)}
  */
  '/pms/pms/sop-step/sort': {Req: {stepIds: any}; Res: Record<string, any>}

  /* 【物业-SOP步骤管理】
  // 查询步骤列表 | object:{sopId:SOP模板ID,categoryId:分类ID}
  export function pmsPmsSopStepList(payload: {sopId: any; categoryId: any}) {return http.post<Res<PmsSopStepVO[]>>('/pms/pms/sop-step/list', payload)}
  */
  '/pms/pms/sop-step/list': {Req: {sopId: any; categoryId: any}; Res: PmsSopStepVO[]}

  /* 【物业-SOP步骤管理】
  // 新增步骤
  export function pmsPmsSopStepInsert(payload: PmsSopStepInsertDTO) {return http.post<Res<PmsSopStepVO>>('/pms/pms/sop-step/insert', payload)}
  */
  '/pms/pms/sop-step/insert': {Req: PmsSopStepInsertDTO; Res: PmsSopStepVO}

  /* 【物业-SOP步骤管理】
  // 导入步骤Excel
  export function pmsPmsSopStepImport() {return http.post<Res<PmsSopImportResultVO>>('/pms/pms/sop-step/import')}
  */
  '/pms/pms/sop-step/import': {Res: PmsSopImportResultVO}

  /* 【物业-SOP步骤管理】
  // 导出步骤Excel | object:{sopId:SOP模板ID}
  export function pmsPmsSopStepExport(payload: {sopId: any}) {return http.post<Res<>>('/pms/pms/sop-step/export', payload)}
  */
  '/pms/pms/sop-step/export': {Req: {sopId: any}}

  /* 【物业-SOP步骤管理】
  // 启用/关闭步骤 | object:{stepId:步骤ID,enable:1启用/0关闭}
  export function pmsPmsSopStepEnable(payload: {stepId: any; enable: any}) {return http.post<Res<Record<string, any>>>('/pms/pms/sop-step/enable', payload)}
  */
  '/pms/pms/sop-step/enable': {Req: {stepId: any; enable: any}; Res: Record<string, any>}

  /* 【物业-SOP分组管理】
  // 分组排序 | object:{groupIds:[分组ID有序列表]}
  export function pmsPmsSopGroupSort(payload: {groupIds: any}) {return http.post<Res<Record<string, any>>>('/pms/pms/sop-group/sort', payload)}
  */
  '/pms/pms/sop-group/sort': {Req: {groupIds: any}; Res: Record<string, any>}

  /* 【物业-SOP分组管理】
  // 按分组名称模糊搜索 | object:{groupName:关键词}，为空则返回全部（同列表）
  export function pmsPmsSopGroupSearch(payload: Record<string, any>) {return http.post<Res<PmsSopGroupVO[]>>('/pms/pms/sop-group/search', payload)}
  */
  '/pms/pms/sop-group/search': {Req: Record<string, any>; Res: PmsSopGroupVO[]}

  /* 【物业-SOP分组管理】
  // 分组列表（含SOP模板）
  export function pmsPmsSopGroupList() {return http.post<Res<PmsSopGroupVO[]>>('/pms/pms/sop-group/list')}
  */
  '/pms/pms/sop-group/list': {Res: PmsSopGroupVO[]}

  /* 【物业-SOP分组管理】
  // 新建分组
  export function pmsPmsSopGroupInsert(payload: PmsSopGroupInsertDTO) {return http.post<Res<PmsSopGroupVO>>('/pms/pms/sop-group/insert', payload)}
  */
  '/pms/pms/sop-group/insert': {Req: PmsSopGroupInsertDTO; Res: PmsSopGroupVO}

  /* 【物业-SOP分组管理】
  // 删除分组 | object:{groupId:分组ID}
  export function pmsPmsSopGroupDelete(payload: {groupId: any}) {return http.post<Res<Record<string, any>>>('/pms/pms/sop-group/delete', payload)}
  */
  '/pms/pms/sop-group/delete': {Req: {groupId: any}; Res: Record<string, any>}

  /* 【物业-SOP分类管理】
  // 查询SOP分类列表（含步骤数量） | object:{sopId:SOP模板ID}
  export function pmsPmsSopCategoryList(payload: {sopId: any}) {return http.post<Res<PmsSopCategoryVO[]>>('/pms/pms/sop-category/list', payload)}
  */
  '/pms/pms/sop-category/list': {Req: {sopId: any}; Res: PmsSopCategoryVO[]}

  /* 【物业-SOP分类管理】
  // 新建SOP分类
  export function pmsPmsSopCategoryInsert(payload: PmsSopCategoryInsertDTO) {return http.post<Res<PmsSopCategoryVO>>('/pms/pms/sop-category/insert', payload)}
  */
  '/pms/pms/sop-category/insert': {Req: PmsSopCategoryInsertDTO; Res: PmsSopCategoryVO}

  /* 【物业-SOP分类管理】
  // 删除SOP分类 | object:{categoryId:分类ID}
  export function pmsPmsSopCategoryDelete(payload: {categoryId: any}) {return http.post<Res<Record<string, any>>>('/pms/pms/sop-category/delete', payload)}
  */
  '/pms/pms/sop-category/delete': {Req: {categoryId: any}; Res: Record<string, any>}

  /* 【物业-人房关系管理】
  // 更新人房关系（协议状态/文件/到期状态）
  export function pmsPmsRelationshipUpdate(payload: PmsRelationshipUpdateDTO) {return http.post<Res<Record<string, any>>>('/pms/pms/relationship/update', payload)}
  */
  '/pms/pms/relationship/update': {Req: PmsRelationshipUpdateDTO; Res: Record<string, any>}

  /* 【物业-人房关系管理】
  // 人房关系列表查询（分页）
  export function pmsPmsRelationshipList(payload: PmsRelationshipListDTO) {return http.post<Res<PmsRelationshipVO[]>>('/pms/pms/relationship/list', payload)}
  */
  '/pms/pms/relationship/list': {Req: PmsRelationshipListDTO; Res: PmsRelationshipVO[]}

  /* 【物业-人房关系管理】
  // 新建人房关系
  export function pmsPmsRelationshipInsert(payload: PmsRelationshipInsertDTO) {return http.post<Res<PmsRelationshipVO>>('/pms/pms/relationship/insert', payload)}
  */
  '/pms/pms/relationship/insert': {Req: PmsRelationshipInsertDTO; Res: PmsRelationshipVO}

  /* 【物业-人房关系管理】
  // 人房关系详情
  export function pmsPmsRelationshipGet(payload: Record<string, any>) {return http.post<Res<PmsRelationshipVO>>('/pms/pms/relationship/get', payload)}
  */
  '/pms/pms/relationship/get': {Req: Record<string, any>; Res: PmsRelationshipVO}

  /* 【物业-人房关系管理】
  // 迁出（终止单条人房关系）
  export function pmsPmsRelationshipCheckOut(payload: Record<string, any>) {return http.post<Res<Record<string, any>>>('/pms/pms/relationship/checkOut', payload)}
  */
  '/pms/pms/relationship/checkOut': {Req: Record<string, any>; Res: Record<string, any>}

  /* 【物业-项目资产档案】
  // 编辑项目
  export function pmsPmsProjectUpdate(payload: PmsProjectUpsertDTO) {return http.post<Res<Record<string, any>>>('/pms/pms/project/update', payload)}
  */
  '/pms/pms/project/update': {Req: PmsProjectUpsertDTO; Res: Record<string, any>}

  /* 【物业-项目资产档案】
  // 项目分页查询
  export function pmsPmsProjectList(payload: PmsProjectListDTO) {return http.post<Res<PmsProjectVO[]>>('/pms/pms/project/list', payload)}
  */
  '/pms/pms/project/list': {Req: PmsProjectListDTO; Res: PmsProjectVO[]}

  /* 【物业-项目资产档案】
  // 导出项目Excel
  export function pmsPmsProjectListExport(payload: PmsProjectListDTO) {return http.post<Res<>>('/pms/pms/project/list-export', payload)}
  */
  '/pms/pms/project/list-export': {Req: PmsProjectListDTO}

  /* 【物业-项目资产档案】
  // 导出字段元数据
  export function pmsPmsProjectListExportMeta(payload: Record<string, any>) {return http.post<Res<PairModel[]>>('/pms/pms/project/list-export-meta', payload)}
  */
  '/pms/pms/project/list-export-meta': {Req: Record<string, any>; Res: PairModel[]}

  /* 【物业-项目资产档案】
  // 引入项目
  export function pmsPmsProjectIntroduce(payload: PmsProjectIntroduceDTO) {return http.post<Res<Record<string, any>>>('/pms/pms/project/introduce', payload)}
  */
  '/pms/pms/project/introduce': {Req: PmsProjectIntroduceDTO; Res: Record<string, any>}

  /* 【物业-项目资产档案】
  // 搜索可引入的资产项目
  export function pmsPmsProjectIntroduceSearch(payload: PmsProjectListDTO) {return http.post<Res<PmsProjectVO[]>>('/pms/pms/project/introduce/search', payload)}
  */
  '/pms/pms/project/introduce/search': {Req: PmsProjectListDTO; Res: PmsProjectVO[]}

  /* 【物业-项目资产档案】
  // 新增项目
  export function pmsPmsProjectInsert(payload: PmsProjectUpsertDTO) {return http.post<Res<PmsProjectDetailVO>>('/pms/pms/project/insert', payload)}
  */
  '/pms/pms/project/insert': {Req: PmsProjectUpsertDTO; Res: PmsProjectDetailVO}

  /* 【物业-项目资产档案】
  // 项目详情
  export function pmsPmsProjectGet(payload: Record<string, any>) {return http.post<Res<PmsProjectDetailVO>>('/pms/pms/project/get', payload)}
  */
  '/pms/pms/project/get': {Req: Record<string, any>; Res: PmsProjectDetailVO}

  /* 【物业-项目资产档案】
  // 启用/禁用项目
  export function pmsPmsProjectEnable(payload: Record<string, any>) {return http.post<Res<Record<string, any>>>('/pms/pms/project/enable', payload)}
  */
  '/pms/pms/project/enable': {Req: Record<string, any>; Res: Record<string, any>}

  /* 【物业-项目配置】
  // 保存装修协议配置
  export function pmsPmsProjectConfigSaveRenovation(payload: PmsProjectConfigRenovationDTO) {return http.post<Res<Record<string, any>>>('/pms/pms/project/config/save-renovation', payload)}
  */
  '/pms/pms/project/config/save-renovation': {Req: PmsProjectConfigRenovationDTO; Res: Record<string, any>}

  /* 【物业-项目配置】
  // 保存财务配置
  export function pmsPmsProjectConfigSaveFinance(payload: PmsProjectConfigFinanceDTO) {return http.post<Res<Record<string, any>>>('/pms/pms/project/config/save-finance', payload)}
  */
  '/pms/pms/project/config/save-finance': {Req: PmsProjectConfigFinanceDTO; Res: Record<string, any>}

  /* 【物业-项目配置】
  // 保存基本配置
  export function pmsPmsProjectConfigSaveBasic(payload: PmsProjectConfigBasicDTO) {return http.post<Res<Record<string, any>>>('/pms/pms/project/config/save-basic', payload)}
  */
  '/pms/pms/project/config/save-basic': {Req: PmsProjectConfigBasicDTO; Res: Record<string, any>}

  /* 【物业-项目配置】
  // 查询项目配置
  export function pmsPmsProjectConfigGet(payload: PmsProjectConfigQueryDTO) {return http.post<Res<PmsProjectConfigVO>>('/pms/pms/project/config/get', payload)}
  */
  '/pms/pms/project/config/get': {Req: PmsProjectConfigQueryDTO; Res: PmsProjectConfigVO}

  /* 【物业-项目查验移交】
  // 更新移交文件状态及附件
  export function pmsPmsHandoverUpdate(payload: PmsHandoverItemUpdateDTO) {return http.post<Res<Record<string, any>>>('/pms/pms/handover/update', payload)}
  */
  '/pms/pms/handover/update': {Req: PmsHandoverItemUpdateDTO; Res: Record<string, any>}

  /* 【物业-项目查验移交】
  // 查询移交文件清单
  export function pmsPmsHandoverList(payload: PmsHandoverListDTO) {return http.post<Res<PmsHandoverItemVO[]>>('/pms/pms/handover/list', payload)}
  */
  '/pms/pms/handover/list': {Req: PmsHandoverListDTO; Res: PmsHandoverItemVO[]}

  /* 【物业-项目查验移交】
  // 编辑遗留问题
  export function pmsPmsHandoverIssueUpdate(payload: PmsLegacyIssueUpdateDTO) {return http.post<Res<Record<string, any>>>('/pms/pms/handover/issue/update', payload)}
  */
  '/pms/pms/handover/issue/update': {Req: PmsLegacyIssueUpdateDTO; Res: Record<string, any>}

  /* 【物业-项目查验移交】
  // 遗留问题列表
  export function pmsPmsHandoverIssueList(payload: PmsHandoverListDTO) {return http.post<Res<PmsLegacyIssueVO[]>>('/pms/pms/handover/issue/list', payload)}
  */
  '/pms/pms/handover/issue/list': {Req: PmsHandoverListDTO; Res: PmsLegacyIssueVO[]}

  /* 【物业-项目查验移交】
  // 新增遗留问题
  export function pmsPmsHandoverIssueInsert(payload: PmsLegacyIssueInsertDTO) {return http.post<Res<PmsLegacyIssueVO>>('/pms/pms/handover/issue/insert', payload)}
  */
  '/pms/pms/handover/issue/insert': {Req: PmsLegacyIssueInsertDTO; Res: PmsLegacyIssueVO}

  /* 【物业-项目查验移交】
  // 删除遗留问题
  export function pmsPmsHandoverIssueDelete(payload: IdDTO) {return http.post<Res<Record<string, any>>>('/pms/pms/handover/issue/delete', payload)}
  */
  '/pms/pms/handover/issue/delete': {Req: IdDTO; Res: Record<string, any>}

  /* 【系统设置-员工管理】
  // 编辑员工扩展字段（员工组别、备注）
  export function pmsPmsEmployeeUpdate(payload: PmsEmployeeUpdateExtDTO) {return http.post<Res<PmsEmployeeVO>>('/pms/pms/employee/update', payload)}
  */
  '/pms/pms/employee/update': {Req: PmsEmployeeUpdateExtDTO; Res: PmsEmployeeVO}

  /* 【系统设置-员工管理】
  // 员工分页查询（基础信息来自 auth_user，扩展字段来自 pms_employee_ext）
  export function pmsPmsEmployeeList(payload: PmsEmployeeListDTO) {return http.post<Res<PmsEmployeeVO[]>>('/pms/pms/employee/list', payload)}
  */
  '/pms/pms/employee/list': {Req: PmsEmployeeListDTO; Res: PmsEmployeeVO[]}

  /* 【系统设置-员工管理】
  // 员工详情 | object:{id:userId}
  export function pmsPmsEmployeeGet(payload: {id: any}) {return http.post<Res<PmsEmployeeVO>>('/pms/pms/employee/get', payload)}
  */
  '/pms/pms/employee/get': {Req: {id: any}; Res: PmsEmployeeVO}

  /* 【系统设置-员工管理】
  // 导出员工Excel
  export function pmsPmsEmployeeExport(payload: PmsEmployeeListDTO) {return http.post<Res<>>('/pms/pms/employee/export', payload)}
  */
  '/pms/pms/employee/export': {Req: PmsEmployeeListDTO}

  /* 【物业-字典管理】
  // 新增/修改字典
  export function pmsPmsDicUpsert(payload: SysDicUpsertDTO) {return http.post<Res<string>>('/pms/pms/dic/upsert', payload)}
  */
  '/pms/pms/dic/upsert': {Req: SysDicUpsertDTO; Res: string}

  /* 【物业-字典管理】
  // 批量更新字典条目排序
  export function pmsPmsDicSortBatch(payload: SysDicSortDTO) {return http.post<Res<Record<string, any>>>('/pms/pms/dic/sort-batch', payload)}
  */
  '/pms/pms/dic/sort-batch': {Req: SysDicSortDTO; Res: Record<string, any>}

  /* 【物业-字典管理】
  // 字典列表
  export function pmsPmsDicList(payload: SysDicListDTO) {return http.post<Res<SysDicVO[]>>('/pms/pms/dic/list', payload)}
  */
  '/pms/pms/dic/list': {Req: SysDicListDTO; Res: SysDicVO[]}

  /* 【物业-字典管理】
  // 字典详情 | object:{dicId:字典ID}
  export function pmsPmsDicGet(payload: {dicId: any}) {return http.post<Res<SysDicVO>>('/pms/pms/dic/get', payload)}
  */
  '/pms/pms/dic/get': {Req: {dicId: any}; Res: SysDicVO}

  /* 【物业-字典管理】
  // 启用/禁用字典 | object:{dicId:字典ID,enable:bool}
  export function pmsPmsDicEnable(payload: {dicId: any; enable: boolean}) {return http.post<Res<Record<string, any>>>('/pms/pms/dic/enable', payload)}
  */
  '/pms/pms/dic/enable': {Req: {dicId: any; enable: boolean}; Res: Record<string, any>}

  /* 【物业-字典管理】
  // 删除字典 | object:{dicId:字典ID}
  export function pmsPmsDicDelete(payload: {dicId: any}) {return http.post<Res<Record<string, any>>>('/pms/pms/dic/delete', payload)}
  */
  '/pms/pms/dic/delete': {Req: {dicId: any}; Res: Record<string, any>}

  /* 【物业-客户信息管理】
  // 新增客户车辆
  export function pmsPmsCustomerVehicleInsert(payload: PmsCustomerVehicleInsertDTO) {return http.post<Res<Record<string, any>>>('/pms/pms/customer/vehicle/insert', payload)}
  */
  '/pms/pms/customer/vehicle/insert': {Req: PmsCustomerVehicleInsertDTO; Res: Record<string, any>}

  /* 【物业-客户信息管理】
  // 删除车辆（软删除）
  export function pmsPmsCustomerVehicleDelete(payload: Record<string, any>) {return http.post<Res<Record<string, any>>>('/pms/pms/customer/vehicle/delete', payload)}
  */
  '/pms/pms/customer/vehicle/delete': {Req: Record<string, any>; Res: Record<string, any>}

  /* 【物业-客户信息管理】
  // 编辑客户
  export function pmsPmsCustomerUpdate(payload: PmsCustomerUpdateDTO) {return http.post<Res<Record<string, any>>>('/pms/pms/customer/update', payload)}
  */
  '/pms/pms/customer/update': {Req: PmsCustomerUpdateDTO; Res: Record<string, any>}

  /* 【物业-客户信息管理】
  // 客户列表（分页+筛选）
  export function pmsPmsCustomerList(payload: PmsCustomerListDTO) {return http.post<Res<PmsCustomerVO[]>>('/pms/pms/customer/list', payload)}
  */
  '/pms/pms/customer/list': {Req: PmsCustomerListDTO; Res: PmsCustomerVO[]}

  /* 【物业-客户信息管理】
  // 新建客户（手机号唯一键upsert）
  export function pmsPmsCustomerInsert(payload: PmsCustomerInsertDTO) {return http.post<Res<PmsCustomerVO>>('/pms/pms/customer/insert', payload)}
  */
  '/pms/pms/customer/insert': {Req: PmsCustomerInsertDTO; Res: PmsCustomerVO}

  /* 【物业-客户信息管理】
  // 客户详情（含车辆列表）
  export function pmsPmsCustomerGet(payload: Record<string, any>) {return http.post<Res<PmsCustomerDetailVO>>('/pms/pms/customer/get', payload)}
  */
  '/pms/pms/customer/get': {Req: Record<string, any>; Res: PmsCustomerDetailVO}

  /* 【物业-客户信息管理】
  // 客户信息导出Excel
  export function pmsPmsCustomerExport(payload: PmsCustomerListDTO) {return http.post<Res<>>('/pms/pms/customer/export', payload)}
  */
  '/pms/pms/customer/export': {Req: PmsCustomerListDTO}

  /* 【通用相关】
  // 中文转拼音 | object:{key:中文}
  export function pmsCommonFuncZhToPinyin(payload: {key: any}) {return http.post<Res<string>>('/pms/common/func/zh-to-pinyin', payload)}
  */
  '/pms/common/func/zh-to-pinyin': {Req: {key: any}; Res: string}

  /* 【通用相关】
  // 身份证判断男女 | object:{certNo:身份证}
  export function pmsCommonFuncCertNoToGender(payload: {certNo: any}) {return http.post<Res<string>>('/pms/common/func/certNo-to-gender', payload)}
  */
  '/pms/common/func/certNo-to-gender': {Req: {certNo: any}; Res: string}

  /* 【通用相关】
  // 文件上传(type,file)
  export function pmsCommonFileUpload() {return http.post<Res<FileModel>>('/pms/common/file/upload')}
  */
  '/pms/common/file/upload': {Res: FileModel}

  /* 【通用相关】
  // 文件上传(type,file,filename)
  export function pmsCommonFileUploadBase64() {return http.post<Res<FileModel>>('/pms/common/file/upload-base64')}
  */
  '/pms/common/file/upload-base64': {Res: FileModel}

  /* 【通用相关】
  // 文件ID转文件Model,入参[id1,id2]
  export function pmsCommonFileIdToPath() {return http.post<Res<FileModel[]>>('/pms/common/file/id-to-path')}
  */
  '/pms/common/file/id-to-path': {Res: FileModel[]}

  /* 【通用相关】
  // 码表元信息
  export function pmsCommonDicMeta(payload: Record<string, any>) {return http.post<Res<Record<string, Record<string, any>>[]>>('/pms/common/dic/meta', payload)}
  */
  '/pms/common/dic/meta': {Req: Record<string, any>; Res: Record<string, Record<string, any>>[]}

  /* 【通用相关】
  // 树形码表 | object:{dicType:字典类型}
  export function pmsCommonDicListTree(payload: {dicType: any}) {return http.post<Res<SysDicVO[]>>('/pms/common/dic/list-tree', payload)}
  */
  '/pms/common/dic/list-tree': {Req: {dicType: any}; Res: SysDicVO[]}

  /* 【通用相关】
  // 常规码表
  export function pmsCommonDicListAll(payload: Record<string, any>) {return http.post<Res<Record<string, SysDicVO[]>>>('/pms/common/dic/list-all', payload)}
  */
  '/pms/common/dic/list-all': {Req: Record<string, any>; Res: Record<string, SysDicVO[]>}

  /* 【通用相关】
  // 省_市_区_商圈 | object:{pid:上级ID}
  export function pmsCommonAreaList(payload: {pid: any}) {return http.post<Res<PairModel[]>>('/pms/common/area/list', payload)}
  */
  '/pms/common/area/list': {Req: {pid: any}; Res: PairModel[]}

  /* 【通用相关】
  // 根据城市查询区和街道(树) | object:{cityCode:城市CODE}
  export function pmsCommonAreaCityInfo(payload: {cityCode: any}) {return http.post<Res<Record<string, TreeModel[]>>>('/pms/common/area/city-info', payload)}
  */
  '/pms/common/area/city-info': {Req: {cityCode: any}; Res: Record<string, TreeModel[]>}
}

interface SysActionLogListDTO {
  pageable: boolean
  pageNum: number
  pageSize: number
  exportFields: string[]
  uname: string // 操作人姓名
  sysId: string // 系统ID
  client: string // 终端设备
  module: string // 操作模块
  type: string // 操作类型
  ip: string // IP
  content: string // 内容
  insertTimeBegin: string // 记录插入时间
  insertTimeEnd: string // 记录插入时间
}

interface SysActionLogVO {
  id: string // 日志ID
  uname: string // 操作人姓名
  sysId: string // 操作系统
  client: string // 终端设备
  module: string // 操作模块
  type: string // 操作类型
  ip: string // IP地址
  content: string // 内容
  insertTime: string // 日志时间
}

interface OpenAppUpsertDTO {
  appId?: string // 应用ID
  appSecret: string // 应用secret
  appName: string // 应用名称
  whitelistHost?: string // 域名白名单
  whitelistIp?: string // IP白名单
  homeUrl?: string // 应用主页URL
  logoutUrl?: string // 用户登出通知地址
}

interface OpenAppListDTO {
  pageable: boolean
  pageNum: number
  pageSize: number
  exportFields: string[]
  appId: string // 应用ID
  appName: string // 应用名称
  homeUrl: string // 应用主页URL
  logoutUrl: string // 用户登出通知地址
  insertTimeBegin: string // 记录插入时间
  insertTimeEnd: string // 记录插入时间
}

interface OpenAppVO {
  appId: string // 应用ID
  appSecret: string // 应用secret
  appName: string // 应用名称
  whitelistHost: string // 域名白名单
  whitelistIp: string // IP白名单
  homeUrl: string // 应用主页URL
  logoutUrl: string // 用户登出通知地址
  enable: number // 是否启用 1:启用0:关闭
  valid: number // 记录是否有效
  insertTime: string // 记录插入时间
  insertBy: string // 记录插入操作人
  updateTime: string // 记录更新时间
  updateBy: string // 记录更新操作人
}

interface JSONConfig {
  keyComparator: any
  ignoreError: boolean
  ignoreCase: boolean
  dateFormat: string
  ignoreNullValue: boolean
  transientSupport: boolean
  stripTrailingZeros: boolean
  checkDuplicate: boolean
  writeLongAsString: boolean
  order: boolean
}

interface JSONObject {
  raw: Record<string, any>
  config: JSONConfig
  empty: boolean
}

interface FileModel {
  id: string // 文件ID
  type: number // 文件类型
  path: string // 文件路径
  url: string // 文件URL
  name: string // 原始文件名
  size: number // 文件大小(byte)
  md5: string // 文件MD5
}

interface SysDicVO {
  dicId: string // ID
  dicType: number // 字典类型
  dicPcode: string // 父级ID（用于树形结构，顶级为NULL）
  dicCode: string // 字典编码（唯一标识）
  dicCodeShort: string // 字典编码简称
  dicName: string // 字典名称
  dicNameShort: string // 字典简称
  dicSys: string // 字典所属系统
  dicSysTag: number // 是否为系统内置标签（0-否，1-是）
  dicLevel: number // 层级深度（从1开始）
  dicSort: number // 排序值（越小越靠前）
  dicNotes: string // 字典备注
  enable: number // 0-禁用;1-启用
  valid: number // 记录是否有效
  insertTime: string // 记录插入时间
  insertBy: string // 记录插入操作人
  updateTime: string // 记录更新时间
  updateBy: string // 记录更新操作人
  dicPname: string // 父级名称
  children: SysDicVO[] // 子级字典
}

interface PairModel {
  k: string
  v: string
}

interface TreeModel {
  value: string
  label: string
  pid: string
  type: string
  enable: boolean
  checked: boolean
  children: TreeModel[]
}

interface AuthLoginDTO {
  loginType: string // 登录类型(PWD,SMS,APP_SCAN,WEWORK)
  loginAccount: string // 登录账号/手机号/企业微信Code
  loginPwd?: string // 登录密码
  imgId?: string // 图形验证码ID
  imgCode?: string // 图形验证码
  verifyCode?: string // 短信验证码
}

interface AuthOrgVO {
  orgId: string // 部门ID
  orgPid: string // 上级部门ID
  orgName: string // 部门名称
  orgCode: string // 自定义部门编码
  orgLevel: number // 部门级别
  orgRank: number // 部门排序
  notes: string // 部门描述
  enable: number // 启用状态（1：启用、0：禁用）
  valid: number // 记录是否有效
  insertTime: string // 记录插入时间
  insertBy: string // 记录插入操作人
  updateTime: string // 记录更新时间
  updateBy: string // 记录更新操作人
  children: AuthOrgVO[] // 子部门列表
  userIdCount: number // 用户计数
  userList: any // 用户列表
}

interface AuthPermissionVO {
  permId: string // 权限ID
  permPid: string // 上级权限ID
  sysId: string // 系统编码
  permCode: string // 自定义权限编码
  permName: string // 权限名称
  permType: string // 权限类型(MENU:菜单,BTN:按钮)
  permPath: string // 权限路径
  enable: number // 启用状态（1：启用、0：禁用）
  valid: number // 记录是否有效
  insertTime: string // 记录插入时间
  insertBy: string // 记录插入操作人
  updateTime: string // 记录更新时间
  updateBy: string // 记录更新操作人
  sysName: string // 系统名称
  permPname: string // 上级权限名称
  permTypeName: string // 权限类型名称
  children: AuthPermissionVO[] // 子列表
}

interface AuthRoleVO {
  roleId: string // 角色id
  roleName: string // 角色名称
  roleCode: string // 自定义角色编码
  notes: string // 描述
  enable: number // 角色状态（1：启用、0：禁用）
  enableNotes: string // 启停用原因
  valid: number // 记录是否有效
  insertTime: string // 记录插入时间
  insertBy: string // 记录插入操作人
  updateTime: string // 记录更新时间
  updateBy: string // 记录更新操作人
  userIdCount: number // 用户ID统计
  userList: AuthUserVO[] // 用户ID列表
  permList: AuthPermissionVO[] // 权限ID列表
}

interface AuthUserModelVO {
  userId: string // 用户ID
  loginAccount: string // 登录账号
  loginPwdTime: string // 登录密码最近更新时间
  nickName: string // 用户昵称
  certName: string // 证件姓名
  certType: string // 证件类型
  certNo: string // *证件号码
  certCheck: number // 证件号认证
  gender: string // 性别 1:男 2:女
  birthday: string // 生日
  mobile: string // 手机号
  mobileCheck: number // 手机号认证
  email: string // 邮箱
  emailCheck: number // 邮箱认证
  lastLoginTime: string // 最近登录时间
  lastLoginIp: string // 最近登录IP
  avatarFid: string // 头像
  enable: number // 账号启用
  roleList: AuthRoleVO[] // 用户角色
  roleName: string // 用户角色名称
  orgList: AuthOrgVO[] // 用户部门
  orgName: string // 用户部门名称
  permIdList: string[] // 用户权限Id列表
}

interface AuthUserVO {
  userId: string // 用户ID
  loginAccount: string // 登录账号
  loginPwd: string // 登录密码
  loginPwdTime: string // 登录密码最近更新时间
  nickName: string // 用户昵称
  certName: string // 证件姓名
  certType: string // 证件类型
  certNo: string // *证件号码
  certCheck: number // 证件号认证
  gender: string // 性别 1:男 2:女
  birthday: string // 生日
  mobile: string // 手机号
  mobileCheck: number // 手机号认证
  email: string // 邮箱
  emailCheck: number // 邮箱认证
  lastLoginTime: string // 最近登录时间
  lastLoginIp: string // 最近登录IP
  avatarFid: string // 头像
  enable: number // 账号启用
  fingerPrint: string // 认证指纹
  valid: number // 记录是否有效
  insertTime: string // 记录插入时间
  insertBy: string // 记录插入操作人
  updateTime: string // 记录更新时间
  updateBy: string // 记录更新操作人
  avatarFile: FileModel // 头像
  roleList: any // 用户角色
  roleName: string // 用户角色名称
  orgList: AuthOrgVO[] // 用户部门
  orgName: string // 用户部门名称
  permIdList: string[] // 用户权限Id列表
  online: boolean // 用户是否在线
}

interface AuthUserUpsertDTO {
  userId?: string // 用户ID
  loginAccount: string // 登录账号
  nickName?: string // 用户昵称
  certName: string // 证件姓名
  certType?: string // 证件类型
  certNo?: string // *证件号码
  gender: string // 性别(1:男 2:女)
  birthday?: string // 生日
  mobile: string // 手机号
  email?: string // 邮箱
  avatarFid?: string // 头像
  weworkUid?: string // 企业微信UserId
  employeeNumber?: string // 工号
  companyCode?: string // 企业编号
  roleIdList?: string[] // 角色ID列表
  orgIdList?: string[] // 部门ID列表
  errorMsg?: string // 导入错误信息
}

interface AuthUserUpdateRoleDTO {
  userIdList: string[] // 用户ID
  roleIdList: string[] // 角色ID
  remark?: string // 备注
}

interface AuthUserUpdateOrgDTO {
  userIdList: string[] // 用户ID
  orgIdList: string[] // 部门ID
  remark?: string // 备注
}

interface UserTemplateImportCheckVO {
  numRight: number // 正常数量条数
  numError: number // 异常数量条数
  errorMsgList: string[] // 异常提示
}

interface AuthUserListDTO {
  pageable: boolean
  pageNum: number
  pageSize: number
  exportFields: string[]
  keyword: string // 姓名/账号/手机号
  certName: string // 证件姓名
  enable: number // 账号启用
  insertTimeBegin: string // 记录插入时间
  insertTimeEnd: string // 记录插入时间
  lastLoginTimeBegin: string // 最近登录时间
  lastLoginTimeEnd: string // 最近登录时间
  orgId: string // 部门ID
  roleId: string // 角色ID
}

interface AuthUserLoginLogListDTO {
  pageable?: boolean
  pageNum?: number
  pageSize?: number
  exportFields?: string[]
  userId: string // 用户ID
  insertTimeBegin?: string // 记录插入时间
  insertTimeEnd?: string // 记录插入时间
}

interface AuthUserLoginLogVO {
  logId: string // 记录ID
  userId: string // 用户ID
  appType: string // 终端类型
  appVersion: string // 终端版本
  browser: string // 浏览器(UA)
  version: string // 版本(UA)
  platform: string // 平台(UA)
  os: string // 操作系统(UA)
  device: string // 设备名称
  mac: string // MAC地址
  ip: string // IP地址
  address: string // 地址
  insertTime: string // 记录插入时间
}

interface AuthRoleUpsertDTO {
  roleId: string // 角色id
  roleName: string // 角色名称
  roleCode: string // 自定义角色编码
  notes: string // 描述
  enable: number // 角色状态（1：启用、0：禁用）
  enableNotes: string // 启停用原因
  permIdList: string[] // 权限ID列表
  userIdList: string[] // 用户ID列表
}

interface AuthRoleListDTO {
  pageable: boolean
  pageNum: number
  pageSize: number
  exportFields: string[]
  roleId: string // 角色id
  roleName: string // 角色名称
  roleCode: string // 自定义角色编码
  notes: string // 描述
  enable: number // 角色状态（1：启用、0：禁用）
}

interface AuthPermissionUpsertDTO {
  permId?: string // 权限ID
  permPid?: string // 上级权限ID
  sysId?: string // 系统编码
  permCode: string // 自定义权限编码
  permName: string // 权限名称
  permType: string // 权限类型(MENU:菜单,BTN:按钮)
  permPath?: string // 权限路径
}

interface AuthPermissionListDTO {
  pageable: boolean
  pageNum: number
  pageSize: number
  exportFields: string[]
  permId: string // 权限ID
  permPid: string // 上级权限ID
  sysId: string // 系统编码
  permCode: string // 自定义权限编码
  permName: string // 权限名称
  permType: string // 权限类型(MENU:菜单,BTN:按钮)
}

interface AuthOrgUpsertDTO {
  orgId: string // 部门ID
  orgPid: string // 上级部门ID
  orgName: string // 部门名称
  orgCode: string // 自定义部门编码
  orgRank: number // 部门排序
  notes: string // 部门描述
  enable: number // 启用状态（1：启用、0：禁用）
  userIdList: string[] // 用户ID列表
}

interface AuthOrgListDTO {
  pageable: boolean
  pageNum: number
  pageSize: number
  exportFields: string[]
  orgId: string // 部门ID
  orgIdList: string[] // 部门ID列表
  orgPid: string // 上级部门ID
  orgName: string // 部门名称
  orgCode: string // 自定义部门编码
  orgLevel: number // 部门级别
  notes: string // 部门描述
  enable: number // 启用状态（1：启用、0：禁用）
}

interface SysDicUpsertDTO {
  dicId?: string // ID
  dicType: number // 字典类型
  dicPcode?: string // 父级ID（用于树形结构，顶级为NULL）
  dicCode: string // 字典编码（唯一标识）
  dicCodeShort?: string // 字典编码简称
  dicName: string // 字典名称
  dicNameShort?: string // 字典简称
  dicSys?: string // 字典所属系统
  dicSort?: number // 排序值（越小越靠前）
  dicNotes?: string // 字典备注
  enable?: number // 0-禁用;1-启用
}

interface SysDicListDTO {
  pageable: boolean
  pageNum: number
  pageSize: number
  exportFields: string[]
  dicId: string // ID
  dicType: number // 字典类型
  dicPcode: string // 父级ID（用于树形结构，顶级为NULL）
  dicCode: string // 字典编码（唯一标识）
  dicCodeShort: string // 字典编码简称
  dicName: string // 字典名称
  dicNameShort: string // 字典简称
  dicSys: string // 字典所属系统
  dicLevel: number // 层级深度（从1开始）
  enable: number // 0-禁用;1-启用
}

// 资产管理-商铺
interface AssetShopUpsertDTO {
  shopId: string // 商铺编码
  projectId: string // 项目编码
  assetId: string // 楼栋/围合/停车场id
  assetType: string // 楼栋/围合/停车场
  floorId: string // 楼层编码
  ownershipUnitCode: string // 产权单位编码
  ownershipUnitName: string // 产权单位名称
  ownershipTypeCode: string // 产权类型编码
  ownershipTypeName: string // 产权类型名称
  ownershipYear: number // 产权年限
  ownershipRatio: number // 产权比例
  realEstateNumber: string // 不动产编号
  shopName: string // 商铺名称
  shopNumber: string // 商铺号
  shopTypeCode: string // 商铺类型编码
  shopTypeName: string // 商铺类型名称
  businessModelCode: string // 经营模式编码
  businessModelName: string // 经营模式名称
  shopHeight: number // 商铺层高
  shopState: number // 0-空闲;1-出租中
  buildingArea: number // 建筑面积
  usableArea: number // 实用面积
  rentalArea: number // 计租面积
  propertyFeeArea: number // 物业费收费面积
  decorationLevel: string // 装修等级
  resourceCategory: string // 资源类别
  resourceType: string // 资源类型
  resourceLevel: string // 资源等级
  cateringCondition: number // 餐饮条件,0-否;1-是
  gasCondition: number // 燃气,0-否;1-是
  weakCurrentCondition: number // 弱电条件,0-否;1-是
  waterServiceNo: string // 水表号
  powerGridNo: string // 电表号
  gasNo: string // 燃气号
  voltage: string // 电压
  splitNumber: number // 拆分数量
  effectiveTime: string // 生效时间
  expireTime: string // 失效时间
}

interface AssetShopSplitDTO {
  shopId: string // 商铺编码
  shopSplitList: AssetShopSplitDetailDTO[] // 商铺拆分数据
}

// 资产管理-商铺
interface AssetShopSplitDetailDTO {
  shopName: string // 商铺名称
  shopNumber: string // 商铺号
  buildingArea: number // 建筑面积
  usableArea: number // 实用面积
}

// 资产管理-商业管理
interface AssetShopListDTO {
  pageable: boolean
  pageNum: number
  pageSize: number
  exportFields: string[]
  shopId: string // 商铺编码
  shopNumber: string // 商铺号
  buildingArea: number // 建筑面积
  usableArea: number // 实用面积
  projectId: string // 项目编码
  assetId: string // 楼栋/围合编码
  assetName: string // 楼栋/围合名称
  floorId: string // 楼层编码
  projectName: string // 项目名称
  floorName: string // 楼层名称
  ownershipUnitCode: string // 产权单位编码
  businessModelCode: string // 经营模式编码
  provinceCode: string // 所在区域-省 code
  cityCode: string // 所在区域-城市 code
  districtCode: string // 地址-区域 code
  enable: number // 0-禁用;1-启用
}

// 资产管理-商铺
interface AssetShopVO {
  shopId: string // 商铺编码
  shopName: string // 商铺
  shopNumber: string // 商铺号
  buildingArea: number // 建筑面积
  usableArea: number // 实用面积
  projectId: string // 项目编码
  projectName: string // 所属项目
  assetId: string // 楼栋/围合编码
  assetType: string // 楼栋/围合类型
  assetName: string // 楼栋/围合
  floorId: string // 楼层编码
  floorName: string // 楼层
  businessModelCode: string // *经营模式编码
  businessModelName: string // 经营模式
  ownershipUnitCode: string // 产权单位编码
  ownershipUnitName: string // 产权单位
  enable: number // 0-禁用;1-启用
  ownershipTypeCode: string // 产权类型编码
  ownershipTypeName: string // 产权类型
  ownershipYear: number // 产权年限
  ownershipRatio: number // 产权比例
  realEstateNumber: string // 不动产编号
  shopTypeCode: string // 商铺类型编码
  shopTypeName: string // 商铺类型
  shopHeight: number // 商铺层高
  shopState: number // 0-空闲;1-出租中
  splitState: number // 0-未拆分;1-已拆分
  rentalArea: number // 计租面积
  propertyFeeArea: number // 物业费收费面积
  decorationLevel: string // 装修等级
  resourceCategory: string // 资源类别
  resourceType: string // 资源类型
  resourceLevel: string // 资源等级
  cateringCondition: number // 餐饮条件,0-否;1-是
  gasCondition: number // 燃气,0-否;1-是
  weakCurrentCondition: number // 弱电条件,0-否;1-是
  waterServiceNo: string // 水表号
  powerGridNo: string // 电表号
  gasNo: string // 燃气号
  voltage: string // 电压
  effectiveTime: string // 生效时间
  expireTime: string // 失效时间
  children: AssetShopVO[] // 子商铺
}

interface AssetShopInsertDTO {
  shopList: AssetShopUpsertDTO[] // 商铺数据
}

// 资产管理-住宅管理
interface AssetRoomUpsertDTO {
  roomId: string // 住宅编码
  projectId: string // 项目编码
  assetId: string // 楼栋/围合/停车场id
  assetType: string // 楼栋/围合/停车场
  floorId: string // 楼层编码
  ownershipUnitCode: string // 产权单位编码
  ownershipUnitName: string // 产权单位名称
  roomNumber: string // 房间号
  roomLayoutCode: string // 户型编码
  roomLayoutName: string // 户型名称
  roomTypeCode: string // 房屋类型编码
  roomTypeName: string // 房屋类型名称
  businessModelCode: string // 经营模式编码
  businessModelName: string // 经营模式名称
  roomHeight: number // 房间层高
  roomState: number // 0-空闲;1-出租中
  buildingArea: number // 建筑面积
  rentalArea: number // 计租面积
  propertyFeeArea: number // 物业费收费面积
  waterServiceNo: string // 水务户号
  powerGridNo: string // 电网户号
  gasNo: string // 燃气户号
  decorationLevel: string // 房屋装修等级
  leaseType: string // 租赁方式 0-整租;1-合租
}

// 资产管理-住宅管理
interface AssetRoomListDTO {
  pageable: boolean
  pageNum: number
  pageSize: number
  exportFields: string[]
  roomId: string // 住宅编码
  roomNumber: string // 房间号
  roomLayoutCode: string // 户型编码
  projectId: string // 项目编码
  assetId: string // 楼栋/围合/停车场id
  floorId: string // 楼层编码
  projectName: string // 项目名称
  buildingName: string // 楼栋名称
  floorName: string // 楼层名称
  ownershipUnitCode: string // 产权单位编码
  businessModelCode: string // 经营模式编码
  provinceCode: string // 所在区域-省 code
  cityCode: string // 所在区域-城市 code
  districtCode: string // 地址-区域 code
  leaseType: string // 租赁方式 0-整租;1-合租
  enable: number // 0-禁用;1-启用
}

// 资产管理-住宅
interface AssetRoomVO {
  roomId: string // 住宅编码
  roomNumber: string // 房间号
  roomLayoutCode: string // 户型编码
  roomLayoutName: string // 户型
  buildingArea: number // 建筑面积
  projectId: string // 项目编码
  projectName: string // 所属项目
  assetId: string // 楼栋编码
  assetName: string // 楼栋
  floorId: string // 楼层编码
  floorName: string // 楼层
  businessModelCode: string // 经营模式编码
  businessModelName: string // 经营模式
  ownershipUnitCode: string // 产权单位编码
  ownershipUnitName: string // 产权单位
  leaseType: string // 租赁方式 0-整租;1-合租
  enable: number // 0-禁用;1-启用
  roomTypeCode: string // 房屋类型编码
  roomTypeName: string // 房屋类型
  roomHeight: number // 房间层高
  rentalArea: number // 计租面积
  propertyFeeArea: number // 物业费收费面积
  roomState: number // 0-空闲;1-出租中
  waterServiceNo: string // 水务户号
  powerGridNo: string // 电网户号
  gasNo: string // 燃气户号
  decorationLevel: string // 房屋装修等级
}

interface AssetRoomInsertDTO {
  roomList: AssetRoomUpsertDTO[] // 住宅数据
}

// 资产管理-空间点位资源
interface AssetResourceUpsertDTO {
  resourceId: string // 空间资源编码
  projectId: string // 项目编码
  assetId: string // 资产编码
  assetType: string // 资产类型(楼栋/围合/停车场)
  floorId: string // 楼层编码
  resourceNumber: string // 资源编号
  resourceName: string // 点位名称
  resourceType: string // 点位类型
  resourceTypeCode: string // 点位类型编码
  resourceBusinessType: string // 业务类型
  resourceBusinessTypeCode: string // 业务类型编码
  resourceAdType: string // 广告类型
  resourceAdTypeCode: string // 广告类型编码
  resourceMediaType: string // 媒体类型
  resourceMediaTypeCode: string // 媒体类型编码
  resourceBusinessTag: string // 业务标签
  resourceBusinessTagCode: string // 业务标签编码
  resourceSpecs: string // 资源规格
  resourceArea: number // 资源面积
  resourceState: number // 资源状态，0-待租;1-已租
  locationCode: string // 位置编码
  locationName: string // 位置名称
  businessModelCode: string // 经营模式编码
  businessModelName: string // 经营模式名称
  locationId: string // 房间号/商铺号
}

interface AssetLocationIdListDTO {
  businessModelCode: string // 经营模式编码
  floorId: string // 楼层编码
}

// 资产管理-空间点位资源
interface AssetResourceListDTO {
  pageable: boolean
  pageNum: number
  pageSize: number
  exportFields: string[]
  projectId: string // 项目编码
  resourceId: string // 资源编码
  resourceName: string // 资源名称
  resourceNumber: string // 资源编号
  assetName: string // 楼栋/围合名称
  floorName: string // 楼层名称
  projectName: string // 项目名称
  resourceTypeCode: string // 资源类型
  resourceBusinessTypeCode: string // 资源业务类型
  resourceAdTypeCode: string // 资源广告类型
  resourceMediaTypeCode: string // 资源媒体类型
  resourceState: number // 资源状态，0-待租;1-已租
  resourceSpecs: string // 资源规格
  locationName: string // 位置名称
  resourceArea: number // 资源面积
  enable: number // 0-禁用;1-启用
}

// 资产管理-空间点位资源
interface AssetResourceVO {
  resourceId: string // 点位编码
  resourceName: string // 点位
  resourceNumber: string // 点位编号
  resourceType: string // 点位类型
  resourceTypeCode: string // 点位类型编码
  resourceBusinessType: string // 业务类型
  resourceBusinessTypeCode: string // 业务类型编码
  resourceAdType: string // 广告类型
  resourceAdTypeCode: string // 广告类型编码
  resourceMediaType: string // 媒体类型
  resourceMediaTypeCode: string // 媒体类型编码
  projectId: string // 项目编码
  projectName: string // 所属项目
  assetName: string // 楼栋/围合
  floorName: string // 楼层
  resourceSpecs: string // 规格
  resourceArea: number // 面积
  resourceState: number // 状态，0-待租;1-已租
  locationCode: string // 位置编码
  locationName: string // 位置
  businessModelCode: string // 经营模式编码
  businessModelName: string // 经营模式
  resourceBusinessTag: string // 业务标签
  resourceBusinessTagCode: string // 业务标签编码
  locationId: string // 房间号/商铺号
  enable: number // 0-禁用;1-启用
}

interface AssetResourceInsertDTO {
  resourceList: AssetResourceUpsertDTO[] // 资源数据
}

interface AssetResourceIdGenerateDTO {
  projectId: string // 项目编码
  floorId: string // 楼层编码
  locationCode: string // 位置编码
  locationId: string // 房间号/商铺号
  resourceBusinessTypeCode: string // 业务类型编码
  resourceMediaTypeCode: string // 媒体类型编码
}

interface AssetResourceBatchEnableDTO {
  resourceIdList: string[] // 固定资产编码列表
  enable: boolean // 启用状态（1：启用、0：禁用）
}

interface AssetProjectUpsertDTO {
  projectId: string // 项目编码
  projectCoverImage: string // 封面照片
  projectName: string // 项目名称
  projectShortName: string // 项目简称
  provinceCode: string // 所在区域-省 code
  provinceName: string // 所在区域-省名称
  cityCode: string // 所在区域-城市 code
  cityName: string // 所在区域-城市名称
  districtCode: string // 地址-区域 code
  districtName: string // 地址-区域名称
  address: string // 地址-详细地址
  lng: number // 经度
  lat: number // 纬度
  landNumber: string // 宗地号
  ownershipPropertyCode: string // 产权性质编码
  ownershipPropertyName: string // 产权性质名称
  ownershipUnitCode: string // 产权单位编码
  ownershipUnitName: string // 产权单位名称
  collectWayCode: string // 筹集方式编码
  collectWayName: string // 筹集方式名称
  collectSubjectCode: string // 筹集主体编码
  collectSubjectName: string // 筹集主体名称
  collectDate: string // 筹集日期
  businessModelCode: string // 经营模式编码
  businessModelName: string // 经营模式名称
  projectTypeCode: string // 项目类型编码
  projectTypeName: string // 项目类型名称
  projectManager: string // 项目负责人
  projectPhone: string // 项目电话
  totalLandArea: number // 总占地面积
  totalArea: number // 总建筑面积
  groundArea: number // 地上建筑面积
  undergroundArea: number // 地下建筑面积
  roomArea: number // 住宅建筑面积
  roomUtilityArea: number // 住宅实用面积
  shopArea: number // 商业面积
  shopUtilityArea: number // 商业实用面积
  manageRoomArea: number // 管理用房面积
  deviceRoomArea: number // 设备用房面积
  greenArea: number // 绿化面积
  propertyFeeArea: number // 物业费收费面积
  roadArea: number // 道路面积
  plotRatio: string // 容积率
  completeDate: string // 竣工时间
  prepareDate: string // 竣备时间
  totalHouseholds: number // 总户数
  groundParkingSpace: number // 地上车位数量
  undergroundParkingSpace: number // 地下车位数量
  machineryParkingSpace: number // 机械车位数量
  parkingSpaceRatio: string // 车位配比
  staffEntrance: number // 人行出入口数量
  carEntrance: number // 车辆出入口数量
  customElevator: number // 客梯数量
  goodsElevator: number // 货梯数量
  firefightElevator: number // 消防梯数量
  propertyFeeModel: string // 物业费收费模式
  roomStandard: string // 住宅物业收费标准
  shopStandard: string // 底商物业收费标准
  independentShopStandard: string // 独立商业物业收费标准
  groundParkingStandard: string // 地上车位收费标准
  undergroundParkingStandard: string // 地下车位收费标准
  checkInDate: string // 入伙时间
  contractBegin: string // 物业合同生效日期
  contractEnd: string // 物业合同终止日期
  propertyCompany: string // 物业公司名称
  warrantyContractBegin: string // 质保合同生效日期
  warrantyContractEnd: string // 质保合同终止日期
  enable: number // 0-禁用;1-启用
}

interface AssetProjectListDTO {
  pageable: boolean
  pageNum: number
  pageSize: number
  exportFields: string[]
  projectId: string // 项目编码
  projectName: string // 项目名称
  projectShortName: string // 项目简称
  provinceCode: string // 所在区域-省 code
  cityCode: string // 所在区域-城市 code
  districtCode: string // 地址-区域 code
  address: string // 详细地址
  collectWayCode: string // 筹集方式编码
  ownershipUnitCode: string // 产权单位编码
  ownershipPropertyCode: string // 产权性质编码
  businessModelCode: string // 经营模式编码
  projectTypeCode: string // 项目类型编码
  enable: number // 状态
}

// 资产管理-项目管理
interface AssetProjectVO {
  projectId: string // 项目编码
  projectCoverImage: string // 封面照片
  projectName: string // 项目名称
  projectShortName: string // 项目简称
  areaName: string // 所在省市区
  provinceCode: string // 省份编码
  provinceName: string // 省份
  cityCode: string // 城市编码
  cityName: string // 城市
  districtCode: string // 区域编码
  districtName: string // 区域
  address: string // 详细地址
  lng: number // 经度
  lat: number // 纬度
  landNumber: string // 宗地号
  ownershipPropertyCode: string // 产权性质编码
  ownershipPropertyName: string // 产权性质
  ownershipUnitCode: string // 产权单位编码
  ownershipUnitName: string // 产权单位
  collectWayCode: string // 筹集方式编码
  collectWayName: string // 筹集方式
  collectSubjectCode: string // 筹集主体编码
  collectSubjectName: string // 筹集主体
  collectDate: string // 筹集日期
  businessModelCode: string // 经营模式编码
  businessModelName: string // 经营模式
  projectTypeCode: string // 项目类型编码
  projectTypeName: string // 项目类型
  projectManager: string // 项目负责人
  projectPhone: string // 项目电话
  totalLandArea: number // 总占地面积
  totalArea: number // 总建筑面积
  groundArea: number // 地上建筑面积
  undergroundArea: number // 地下建筑面积
  roomArea: number // 住宅建筑面积
  roomUtilityArea: number // 住宅实用面积
  shopArea: number // 商业面积
  shopUtilityArea: number // 商业实用面积
  manageRoomArea: number // 管理用房面积
  deviceRoomArea: number // 设备用房面积
  greenArea: number // 绿化面积
  propertyFeeArea: number // 物业费收费面积
  roadArea: number // 道路面积
  plotRatio: string // 容积率
  completeDate: string // 竣工时间
  prepareDate: string // 竣备时间
  totalHouseholds: number // 总户数
  groundParkingSpace: number // 地上车位数量
  undergroundParkingSpace: number // 地下车位数量
  machineryParkingSpace: number // 机械车位数量
  parkingSpaceRatio: string // 车位配比
  staffEntrance: number // 人行出入口数量
  carEntrance: number // 车辆出入口数量
  customElevator: number // 客梯数量
  goodsElevator: number // 货梯数量
  firefightElevator: number // 消防梯数量
  propertyFeeModel: string // 物业费收费模式
  roomStandard: string // 住宅物业收费标准
  shopStandard: string // 底商物业收费标准
  independentShopStandard: string // 独立商业物业收费标准
  groundParkingStandard: string // 地上车位收费标准
  undergroundParkingStandard: string // 地下车位收费标准
  checkInDate: string // 入伙时间
  contractBegin: string // 物业合同生效日期
  contractEnd: string // 物业合同终止日期
  propertyCompany: string // 物业公司
  warrantyContractBegin: string // 质保合同生效日期
  warrantyContractEnd: string // 质保合同终止日期
  enable: number // 0-禁用;1-启用
  buildingCount: number // 楼栋数量
  floorCount: number // 楼层数量
  roomCount: number // 住宅数量
  enclosureCount: number // 围合数量
  fixedCount: number // 固定资产数量
  shopCount: number // 商铺数量
  parkingCount: number // 停车场数量
  parkingSpaceCount: number // 停车位数量
  resourceCount: number // 空间点位数量
  coverImageModel: FileModel // 封面照片文件对象
}

// 资产管理-停车场管理
interface AssetParkingDTO {
  parkingId: string // 停车场编码
  projectId: string // 项目编码
  parkingName: string // 停车场名称
  parkingMethodCode: string // 停车方式编码
  parkingMethodName: string // 停车方式名称
  parkingLocationCode: string // 停车场位置编码
  parkingLocationName: string // 停车场位置名称
  parkingCategoryCode: string // 车位类别编码
  parkingCategoryName: string // 车位类别名称
  parkingSpaceQuantity: number // 停车位数
  parkingArea: number // 面积
  ownershipUnitCode: string // 产权单位编码
  ownershipUnitName: string // 产权单位名称
}

interface AssetParkingRegionDTO {
  regionCategoryCode: string // 区域类别编码
  regionCategoryName: string // 区域类别名称
  regionMapFid: string // 区域地图图片文件ID
  regionId: string // 车位区域编码
  regionName: string // 车位区域名称
}

// 资产管理-新增/更新停车场DTO
interface AssetParkingUpsertDTO {
  parking: AssetParkingDTO // 停车场信息
  parkingSpaceRegions: AssetParkingRegionDTO[] // 车位区域信息
}

interface AssetParkingRegionVO {
  regionCategoryCode: string // 区域类别编码
  regionCategoryName: string // 区域类别名称
  regionId: string // 车位区域编码
  regionName: string // 车位区域名称
  regionMapFileModel: FileModel // 区域地图图片文件 Model
}

// 资产管理-停车场管理
interface AssetParkingListDTO {
  pageable: boolean
  pageNum: number
  pageSize: number
  exportFields: string[]
  projectId: string // 项目编码
  parkingId: string // 停车场编码
  parkingName: string // 停车场名称
  projectName: string // 项目名称
  parkingMethodCode: string // 停车方式编码
  parkingLocationCode: string // 停车场位置编码
  parkingCategoryCode: string // 车位类别编码
  enable: number // 是否启用;0-禁用;1-启用
}

// 资产管理-停车场
interface AssetParkingVO {
  projectId: string // 项目编码
  projectName: string // 所属项目
  parkingId: string // 停车场编码
  parkingName: string // 停车场
  parkingMethodCode: string // 停车方式编码
  parkingMethodName: string // 停车方式
  parkingLocationCode: string // 停车场位置编码
  parkingLocationName: string // 停车场位置
  parkingCategoryCode: string // 车位类别编码
  parkingCategoryName: string // 车位类别
  parkingSpaceQuantity: number // 停车位数
  parkingArea: number // 面积
  parkingRegions: AssetParkingRegionVO[] // 车位区域信息
  ownershipUnitCode: string // 产权单位编码
  ownershipUnitName: string // 产权单位
  enable: number // 是否启用;0-禁用;1-启用
}

// 资产管理-停车位
interface AssetParkingSpaceDTO {
  parkingSpaceId: string // 车位编码
  projectId: string // 项目编码
  parkingId: string // 停车场编码
  parkingSpaceName: string // 车位名称
  parkingSpaceRegionId: string // 车位区域编码
  parkingSpaceRegionName: string // 车位区域名称
  parkingSpaceAttributeCode: string // 车位属性编码
  parkingSpaceAttributeName: string // 车位属性名称
  parkingSpaceArea: number // 车位面积
  chargingPortCode: string // 充电位编码
  chargingPortName: string // 充电位名称
  parkingSpaceState: string // 车位状态
  ownershipUnitCode: string // 产权单位编码
  ownershipUnitName: string // 产权单位名称
}

// 资产管理-停车位管理
interface AssetParkingSpaceListDTO {
  pageable: boolean
  pageNum: number
  pageSize: number
  exportFields: string[]
  parkingSpaceName: string // 车位名称
  parkingSpaceId: string // 车位编码
  parkingId: string // 停车场编码
  parkingName: string // 停车场名称
  parkingSpaceRegionId: string // 车位区域编码
  parkingSpaceRegionName: string // 车位区域名称
  projectName: string // 项目名称
  parkingSpaceState: string // 车位状态
  ownershipInfo: string // 权属方信息
  userInfo: string // 使用方信息
  leaseTerm: number // 租期
  licensePlate: string // 车牌号
  enable: number // 启停状态
}

// 资产管理-停车位
interface AssetParkingSpaceVO {
  parkingSpaceName: string // 车位
  parkingSpaceId: string // 车位编码
  parkingId: string // 停车场编码
  parkingName: string // 停车场
  parkingSpaceRegionId: string // 车位区域编码
  parkingSpaceRegionName: string // 车位区域
  projectId: string // 项目编码
  projectName: string // 所属项目
  parkingSpaceAttributeCode: string // 车位属性编码
  parkingSpaceAttributeName: string // 车位属性
  parkingSpaceArea: number // 车位面积
  parkingSpaceState: string // 车位状态
  ownershipUnitCode: string // 产权单位编码
  ownershipUnitName: string // 产权单位
  userInfo: string // 使用方信息
  leaseTerm: number // 租期
  licensePlate: string // 车牌号
  chargingPortCode: string // 是否充电位编码
  chargingPortName: string // 是否充电位
  enable: number // 启停状态
}

// 资产管理-停车位
interface AssetParkingSpaceInsertDTO {
  parkingSpaceList: AssetParkingSpaceDTO[] // 车位列表
}

// 资产管理-楼层管理
interface AssetFloorDTO {
  floorId: string // 楼层编码
  projectId: string // 项目编码
  assetId: string // 资产编码
  assetType: string // 资产类型(楼栋/围合/停车场)
  floorName: string // 楼层名称
  floorHeight: number // 楼层层高
  ownershipUnitCode: string // 产权单位编码
  ownershipUnitName: string // 产权单位名称
  roomList: AssetRoomUpsertDTO[] // 住宅数据
  shopList: AssetShopUpsertDTO[] // 商业信息
}

// 资产管理-楼层管理
interface AssetFloorListDTO {
  pageable: boolean
  pageNum: number
  pageSize: number
  exportFields: string[]
  floorId: string // 楼层编码
  assetId: string // 资产编码
  floorName: string // 楼层名称
  projectName: string // 项目名称
  buildingName: string // 楼栋名称
  enclosureName: string // 围合名称
  enclosureTypeCode: string // 围合类型编码
  ownershipUnitCode: string // 产权单位编码
  enable: number // 0-禁用;1-启用
  assetType: string // 资产类型
}

// 资产管理-楼层
interface AssetFloorVO {
  floorId: string // 楼层编码
  projectId: string // 项目编码
  projectName: string // 所属项目
  assetId: string // 楼栋/围合/停车场编码
  assetName: string // 所属楼栋/围合
  enclosureTypeCode: string // 围合类型编码
  enclosureTypeName: string // 围合类型
  floorName: string // 楼层名称
  floorHeight: number // 楼层层高
  ownershipUnitCode: string // 产权单位编码
  ownershipUnitName: string // 产权单位
  enable: number // 0-禁用;1-启用
}

// 资产管理-固定资产
interface AssetFixedUpsertDTO {
  fixedId: string // 固定资产编码
  projectId: string // 项目编码
  assetId: string // 楼栋/围合/停车场id
  assetType: string // 楼栋/围合/停车场
  floorId: string // 楼层编码
  locationCode: string // 位置编码
  locationName: string // 位置名称
  businessModelCode: string // 经营模式编码
  businessModelName: string // 经营模式名称
  locationId: string // 房间号/商铺号
  fixedName: string // 固定资产名称
  serialNumber: string // 序列号
  fixedTypeCode: string // 资产类型编码
  fixedTypeName: string // 资产类型名称
  deviceTypeCode: string // 设备类型编码
  deviceTypeName: string // 设备类型名称
  fixedBrand: string // 固定资产品牌
  fixedSpecs: string // 固定资产规格
  fixedModel: string // 固定资产型号
  fixedSource: string // 固定资产来源
  purchaseDate: string // 购买日期
  assetAmount: number // 资产金额
  elevatorSpeed: number // 电梯速度(固定资产为电梯时有值)
  parkingSpaceNo: string // 关联车位号(固定资产为充电桩时有值)
  ownershipUnitCode: string // 产权单位编码
  ownershipUnitName: string // 产权单位名称
  deviceWorkState: number // 设备工作状态
  deviceManageUser: string // 设备管理人员
  deviceMajordomoUser: string // 设备总监
  deviceCheckDate: string // 设备年检日期
  deviceInstallDate: string // 设备安装日期
  acceptanceDate: string // 验收日期
  registerDate: string // 注册登记日期
  warrantyExpireDate: string // 设备质保到期日
  warrantyCompany: string // 设备质保方名称
  warrantyLinkman: string // 设备质保方联系人
  warrantyPhone: string // 设备质保方联系方式
  maintenanceCompany: string // 设备维保方名称
  maintenanceLinkman: string // 设备维保方联系人
  maintenancePhone: string // 设备维保方联系方式
  maintenanceExpireDate: string // 设备维保到期日
  nextPatrolDate: string // 下次巡检日期
  nextMaintenanceDate: string // 下次保养日期
  labelList: string[] // 标签
  drawingFidList: string[] // 图纸
  deviceContractFidList: string[] // 设备合同
  deviceInformationFidList: string[] // 设备技术资料
  contractFidList: string[] // 合同
  attachmentFidList: string[] // 其他附件
}

// 资产管理-固定资产
interface AssetFixedListDTO {
  pageable: boolean
  pageNum: number
  pageSize: number
  exportFields: string[]
  projectId: string // 项目编码
  projectName: string // 项目名称
  assetName: string // 资产名称
  floorName: string // 楼层名称
  deviceType: string // 设备类型
  fixedName: string // 固定资产名称
  fixedTypeName: string // 资产类型名称
  deviceTypeCode: string // 设备类型编码
  locationCode: string // 位置编码
  deviceWorkState: number // 设备工作状态
  enable: number // 0-禁用;1-启用
}

// 资产管理-固定资产
interface AssetFixedVO {
  fixedId: string // 固定资产编码
  projectId: string // 项目编码
  projectName: string // 所属项目
  assetId: string // 楼栋/围合/停车场id
  assetName: string // 楼栋/围合/停车场
  assetType: string // 楼栋/围合/停车场
  floorId: string // 楼层编码
  floorName: string // 楼层名称
  locationCode: string // 位置编码
  locationName: string // 位置
  businessModelCode: string // 经营模式编码
  businessModelName: string // 经营模式
  locationId: string // 房间号/商铺号
  fixedName: string // 固定资产
  serialNumber: string // 序列号
  fixedTypeCode: string // 资产类型编码
  fixedTypeName: string // 资产类型
  deviceTypeCode: string // 设备类型编码
  deviceTypeName: string // 设备类型
  fixedBrand: string // 固定资产品牌
  fixedSpecs: string // 固定资产规格
  fixedModel: string // 固定资产型号
  fixedSource: string // 固定资产来源
  purchaseDate: string // 购买日期
  assetAmount: number // 资产金额
  elevatorSpeed: number // 电梯速度(固定资产为电梯时有值)
  parkingSpaceNo: string // 关联车位号(固定资产为充电桩时有值)
  ownershipUnitCode: string // 产权单位编码
  ownershipUnitName: string // 产权单位
  deviceWorkState: number // 设备工作状态
  deviceManageUser: string // 设备管理人员
  deviceMajordomoUser: string // 设备总监
  deviceCheckDate: string // 设备年检日期
  deviceInstallDate: string // 设备安装日期
  acceptanceDate: string // 验收日期
  registerDate: string // 注册登记日期
  warrantyExpireDate: string // 设备质保到期日
  warrantyCompany: string // 设备质保方
  warrantyLinkman: string // 设备质保方联系人
  warrantyPhone: string // 设备质保方联系方式
  maintenanceCompany: string // 设备维保方
  maintenanceLinkman: string // 设备维保方联系人
  maintenancePhone: string // 设备维保方联系方式
  maintenanceExpireDate: string // 设备维保到期日
  nextPatrolDate: string // 下次巡检日期
  nextMaintenanceDate: string // 下次保养日期
  labelList: string[] // 标签
  drawingFileModel: FileModel[] // 图纸
  deviceContractFileModel: FileModel[] // 设备合同
  deviceInformationFileModel: FileModel[] // 设备技术资料
  contractFileModel: FileModel[] // 合同
  attachmentFileModel: FileModel[] // 其他附件
  enable: number // 0-禁用;1-启用
}

interface AssetFixedIdGenerateDTO {
  projectId: string // 项目编码
  floorId: string // 楼层编码
  locationCode: string // 位置编码
  locationId: string // 房间号/商铺号
  fixedTypeCode: string // 资产类型编码
  deviceTypeCode: string // 设备类型编码
}

interface AssetFixedBatchWarrantyDTO {
  fixedIdList?: string[] // 固定资产编码列表
  warrantyCompany?: string // 设备质保方名称
  warrantyLinkman?: string // 设备质保方联系人
  warrantyPhone?: string // 设备质保方联系方式
  warrantyExpireDate?: string // 设备质保到期日
  contractFidList: string[] // 合同
}

interface AssetFixedBatchUpdateDTO {
  fixedIdList?: string[] // 固定资产编码列表
  labelList?: string[] // 标签
  drawingFidList: string[] // 图纸
  deviceContractFidList: string[] // 设备合同
  deviceInformationFidList: string[] // 设备技术资料
}

interface AssetFixedBatchEnableDTO {
  fixedIdList: string[] // 固定资产编码列表
  enable?: boolean // 启用状态（1：启用、0：禁用）
}

interface AssetEnclosureUpdateDTO {
  enclosureId: string // 楼栋编码
  enclosureName: string // 楼栋名称
  projectId: string // 项目编码
  projectName: string // 项目名称
  enclosureTypeCode: string // 围合类型编码
  enclosureTypeName: string // 围合类型名称
  ownershipUnitCode: string // 产权单位编码
  ownershipUnitName: string // 产权单位名称
  totalFloor: number // 总楼层
}

interface AssetEnclosureListDTO {
  pageable: boolean
  pageNum: number
  pageSize: number
  exportFields: string[]
  enclosureId: string // 围合编码
  projectId: string // 项目编码
  projectName: string // 项目名称
  enclosureName: string // 围合名称
  enclosureTypeCode: string // 围合类型编码
  ownershipUnitCode: string // 产权单位编码
  enable: number // 0-禁用;1-启用
}

// 资产管理-围合
interface AssetEnclosureVO {
  enclosureId: string // 围合编码
  enclosureName: string // 围合
  enclosureTypeCode: string // 围合类型编码
  enclosureTypeName: string // 围合类型
  projectId: string // 项目编码
  projectName: string // 所属项目
  ownershipUnitCode: string // 产权单位编码
  ownershipUnitName: string // 产权单位
  totalFloor: number // 总楼层
  enable: number // 0-禁用;1-启用
}

// 资产管理-围合
interface AssetEnclosureInsertDTO {
  enclosureId: string // 围合编码
  projectId: string // 项目编码
  enclosureName: string // 围合名称
  enclosureTypeCode: string // 围合类型编码
  enclosureTypeName: string // 围合类型名称
  ownershipUnitCode: string // 产权单位编码
  ownershipUnitName: string // 产权单位名称
  totalFloor: number // 总楼层
  floorList: AssetFloorDTO[] // 楼层信息
}

interface AssetBuildingUpdateDTO {
  buildingId: string // 楼栋编码
  buildingName: string // 楼栋名称
  ownershipUnitCode: string // 产权单位编码
  ownershipUnitName: string // 产权单位名称
  totalFloor: number // 总层数
  totalRoom: number // 总房间
}

interface AssetBuildingListDTO {
  pageable: boolean
  pageNum: number
  pageSize: number
  exportFields: string[]
  projectName: string // 项目名称
  projectId: string // 项目编码
  buildingId: string // 楼栋编码
  buildingName: string // 楼栋名称
  projectTypeCode: string // 项目类型编码
  ownershipUnitCode: string // 产权单位编码
  enable: number // 状态
}

// 资产管理-楼栋管理
interface AssetBuildingVO {
  buildingId: string // 楼栋编码
  buildingName: string // 楼栋
  projectId: string // 项目编码
  projectName: string // 所属项目
  projectTypeName: string // 项目类型
  ownershipUnitCode: string // 产权单位编码
  ownershipUnitName: string // 产权单位
  totalFloor: number // 总层数
  totalRoom: number // 总房间
  enable: number // 0-禁用;1-启用
}

interface AssetBuildingDTO {
  buildingId: string // 楼栋编码
  buildingName: string // 楼栋名称
  projectId: string // 项目编码
  ownershipUnitCode: string // 产权单位编码
  ownershipUnitName: string // 产权单位名称
  totalFloor: number // 总层数
  totalRoom: number // 总房间
  floorList: AssetFloorDTO[] // 楼层数据
}

interface AssetBuildingInsertDTO {
  buildingList: AssetBuildingDTO[] // 楼栋数据
}

interface PmsSopTemplateListDTO {
  pageable: boolean
  pageNum: number
  pageSize: number
  exportFields: string[]
  searchName: string // SOP名称模糊搜索
  groupId: string // 所属分组ID
}

interface PmsSopTemplateVO {
  id: string // ID
  groupId: string // 所属分组ID
  sopName: string // SOP名称
  description: string // SOP描述
  sortOrder: number // 排序号
  enable: number // 0-禁用;1-启用
  insertTime: string // 记录插入时间
  categoryCount: number // 子项（分类）数量
  categorySummary: string // 子项分类名称摘要
}

interface PmsSopTemplateInsertDTO {
  sopName: string // SOP名称
  groupId?: string // 所属分组ID（不传则使用默认分组）
  description?: string // SOP描述
}

// SOP步骤编辑DTO
interface PmsSopStepUpdateDTO {
  id: string // 步骤ID
  title?: string // 步骤标题
  description?: string // 步骤描述
  prompt?: string // 提示语
  workHours?: number // 工时
  score?: number // 分值
  required?: number // 是否必填(0否/1是)
  photoRequired?: number // 是否需要拍照(0否/1是)
  enable?: number // 状态(0关闭/1启用)
}

// SOP步骤VO
interface PmsSopStepVO {
  id: string // ID
  categoryId: string // 所属分类ID
  sopId: string // 所属SOP模板ID
  seqNo: number // 序号
  title: string // 步骤标题
  description: string // 步骤描述
  prompt: string // 提示语
  workHours: number // 工时
  score: number // 分值
  required: number // 0-非必填;1-必填
  photoRequired: number // 0-不需拍照;1-需拍照
  enable: number // 0-禁用;1-启用
  insertTime: string // 创建时间
}

// SOP步骤新建DTO
interface PmsSopStepInsertDTO {
  categoryId: string // 所属分类ID
  title?: string // 步骤标题
  description?: string // 步骤描述
  prompt?: string // 提示语
  workHours?: number // 工时
  score?: number // 分值
  required?: number // 是否必填(0否/1是)
  photoRequired?: number // 是否需要拍照(0否/1是)
}

// Excel导入结果VO
interface PmsSopImportResultVO {
  successCount: number // 成功条数
  failCount: number // 失败条数
  failReasons: string[] // 失败原因列表
}

interface PmsSopGroupVO {
  id: string // ID
  groupName: string // 分组名称
  sortOrder: number // 排序号
  enable: number // 0-禁用;1-启用
  insertTime: string // 记录插入时间
  sopList: PmsSopTemplateVO[] // 分组下的SOP列表
}

interface PmsSopGroupInsertDTO {
  groupName: string // 分组名称
  sortOrder?: number // 排序号
}

// SOP分类VO
interface PmsSopCategoryVO {
  id: string // ID
  sopId: string // 所属SOP模板ID
  categoryName: string // 分类名称
  sortOrder: number // 排序号
  enable: number // 0-禁用;1-启用
  stepCount: number // 步骤数量
  insertTime: string // 创建时间
}

// SOP分类新建DTO
interface PmsSopCategoryInsertDTO {
  sopId: string // 所属SOP模板ID
  categoryName: string // 分类名称
  sortOrder?: number // 排序号
}

// 更新人房关系 DTO
interface PmsRelationshipUpdateDTO {
  id: string // 关系ID
  agreeStatus?: string // 协议状态: UNSIGNED/SIGNED
  attachmentUrls?: string // 其他资料文件URL列表（JSON数组字符串）
  agreementFileUrl?: string // 物业协议文件URL
  agreementExpired?: number // 物业协议是否到期: 0否, 1是
}

// 人房关系列表查询 DTO
interface PmsRelationshipListDTO {
  pageable: boolean
  pageNum: number
  pageSize: number
  exportFields: string[]
  customerId: string // 客户ID（与roomId二选一必填）
  roomId: string // 房间ID（与customerId二选一必填）
  authStatus: string // 认证状态筛选: PENDING/CERTIFIED/REJECTED
  agreeStatus: string // 协议状态筛选: UNSIGNED/SIGNED
  relationType: string // 关系类型筛选: OWNER/TENANT/COHABITANT/OTHER
}

// 人房关系 VO
interface PmsRelationshipVO {
  id: string // 关系ID（relationship_id，雪花）
  customerId: string // 客户ID
  roomId: string // 房间ID（asset_room.room_id）
  projectId: string // 项目ID（冗余）
  relationType: string // 关系类型: OWNER(业主)/TENANT(租户)/COHABITANT(同住人)/OTHER(其他)
  authStatus: string // 认证状态: PENDING(待审核)/CERTIFIED(已认证)/REJECTED(已驳回)
  agreeStatus: string // 物业协议状态: UNSIGNED(待签署)/SIGNED(已签署)
  effectiveDate: string // 生效日期
  checkOutTime: string // 迁出时间
  attachmentUrls: string // 其他资料文件URL列表（JSON数组字符串）
  agreementFileUrl: string // 物业协议文件URL
  agreementExpired: number // 物业协议是否到期: 0否, 1是
  valid: number // 是否有效: 1有效, 0已迁出
  insertTime: string // 创建时间
  customerName: string // 客户姓名（JOIN pms_customer）
  phone: string // 联系电话（加密存储，Service层脱敏后返回）
  projectName: string // 项目名称（JOIN asset_project）
  buildingName: string // 楼栋/围合名称（JOIN asset_building）
  floorName: string // 楼层名称（JOIN asset_floor）
  roomNumber: string // 房间号（JOIN asset_room）
}

// 新建人房关系 DTO
interface PmsRelationshipInsertDTO {
  customerId: string // 客户ID
  roomId: string // 房间ID（asset_room.room_id）
  relationType: string // 关系类型: OWNER(业主)/TENANT(租户)/COHABITANT(同住人)/OTHER(其他)
  effectiveDate?: string // 生效日期
  attachmentUrls?: string // 其他资料文件URL列表（JSON数组字符串，房产证/购房合同等）
  agreementFileUrl?: string // 物业协议文件URL
}

// 物业-项目新建/编辑DTO
interface PmsProjectUpsertDTO {
  id?: string // PMS项目ID（编辑时必传，新建时不传）
  projectName: string // 项目名称
  projectShortName: string // 项目简称
  projectCoverImage?: string // 封面照片
  provinceCode: string // 省编码
  provinceName?: string // 省名称
  cityCode: string // 市编码
  cityName?: string // 市名称
  districtCode: string // 区编码
  districtName?: string // 区名称
  address: string // 详细地址
  lng: number // 经度
  lat: number // 纬度
  landNumber: string // 宗地号
  ownershipPropertyCode: string // 产权性质编码
  ownershipPropertyName?: string // 产权性质名称
  ownershipUnitCode: string // 产权单位编码
  ownershipUnitName?: string // 产权单位名称
  collectWayCode: string // 项目来源编码
  collectWayName?: string // 项目来源名称
  collectSubjectCode?: string // 筹集主体编码
  collectSubjectName?: string // 筹集主体名称
  collectDate?: string // 筹集日期
  businessModelCode: string // 经营模式编码
  businessModelName?: string // 经营模式名称
  projectTypeCode: string // 项目类型编码
  projectTypeName?: string // 项目类型名称
  projectManager: string // 项目负责人
  projectPhone: string // 项目电话
  totalLandArea?: number // 总占地面积
  totalArea?: number // 总建筑面积
  groundArea?: number // 地上建筑面积
  undergroundArea?: number // 地下建筑面积
  roomArea?: number // 住宅建筑面积
  roomUtilityArea?: number // 住宅实用面积
  shopArea?: number // 商业面积
  shopUtilityArea?: number // 商业实用面积
  manageRoomArea?: number // 管理用房面积
  deviceRoomArea?: number // 设备用房面积
  greenArea?: number // 绿化面积
  propertyFeeArea?: number // 物业费收费面积
  roadArea?: number // 道路面积
  plotRatio?: string // 容积率
  completeDate?: string // 竣工时间
  prepareDate?: string // 竣备时间
  checkInDate?: string // 入伙时间
  contractBegin?: string // 物业合同生效日期
  contractEnd?: string // 物业合同终止日期
  propertyCompany?: string // 物业公司名称
  warrantyContractBegin?: string // 质保合同生效日期
  warrantyContractEnd?: string // 质保合同终止日期
  totalHouseholds?: number // 总户数
  groundParkingSpace?: number // 地上车位数量
  undergroundParkingSpace?: number // 地下车位数量
  machineryParkingSpace?: number // 机械车位数量
  parkingSpaceRatio?: string // 车位配比
  staffEntrance?: number // 人行出入口数量
  carEntrance?: number // 车辆出入口数量
  customElevator?: number // 客梯数量
  goodsElevator?: number // 货梯数量
  firefightElevator?: number // 消防梯数量
  propertyFeeModel?: string // 物业费收费模式
  roomStandard?: string // 住宅物业收费标准
  shopStandard?: string // 底商物业收费标准
  independentShopStandard?: string // 独立商业物业收费标准
  groundParkingStandard?: string // 地上车位收费标准
  undergroundParkingStandard?: string // 地下车位收费标准
}

interface PmsProjectListDTO {
  pageable: boolean
  pageNum: number
  pageSize: number
  exportFields: string[]
  projectName: string // 项目名称（模糊）
  provinceCode: string // 省编码
  cityCode: string // 市编码
  districtCode: string // 区编码
  enable: number // 状态: 1启用, 0禁用
  ownershipUnitCode: string // 产权单位编码
  businessModelCode: string // 经营模式编码
  collectWayCode: string // 项目来源编码（筹集方式）
  ownershipPropertyCode: string // 产权性质编码
}

// 物业-项目列表VO
interface PmsProjectVO {
  id: string // PMS项目ID
  enable: number // 状态: 1启用, 0禁用
  projectId: string // 资产项目编码
  projectName: string // 项目名称
  projectShortName: string // 项目简称
  collectWayName: string // 项目来源
  projectTypeName: string // 项目类型
  ownershipUnitName: string // 产权单位
  ownershipPropertyName: string // 产权性质
  businessModelName: string // 经营模式
  areaName: string // 所属省市区
  address: string // 详细地址
}

interface PmsProjectIntroduceDTO {
  projectIds: string[] // 要引入的资产项目ID列表
}

// 物业-项目详情VO
interface PmsProjectDetailVO {
  id: string // PMS项目ID
  enable: number // 状态: 1启用, 0禁用
  projectId: string // 资产项目编码
  projectCoverImage: string // 封面照片
  projectName: string // 项目名称
  projectShortName: string // 项目简称
  provinceCode: string // 省编码
  provinceName: string // 省名称
  cityCode: string // 市编码
  cityName: string // 市名称
  districtCode: string // 区编码
  districtName: string // 区名称
  address: string // 详细地址
  lng: number // 经度
  lat: number // 纬度
  landNumber: string // 宗地号
  ownershipPropertyCode: string // 产权性质编码
  ownershipPropertyName: string // 产权性质名称
  ownershipUnitCode: string // 产权单位编码
  ownershipUnitName: string // 产权单位名称
  collectWayCode: string // 项目来源编码
  collectWayName: string // 项目来源名称
  collectSubjectCode: string // 筹集主体编码
  collectSubjectName: string // 筹集主体名称
  collectDate: string // 筹集日期
  businessModelCode: string // 经营模式编码
  businessModelName: string // 经营模式名称
  projectTypeCode: string // 项目类型编码
  projectTypeName: string // 项目类型名称
  projectManager: string // 项目负责人
  projectPhone: string // 项目电话
  totalLandArea: number // 总占地面积
  totalArea: number // 总建筑面积
  groundArea: number // 地上建筑面积
  undergroundArea: number // 地下建筑面积
  roomArea: number // 住宅建筑面积
  roomUtilityArea: number // 住宅实用面积
  shopArea: number // 商业面积
  shopUtilityArea: number // 商业实用面积
  manageRoomArea: number // 管理用房面积
  deviceRoomArea: number // 设备用房面积
  greenArea: number // 绿化面积
  propertyFeeArea: number // 物业费收费面积
  roadArea: number // 道路面积
  plotRatio: string // 容积率
  completeDate: string // 竣工时间
  prepareDate: string // 竣备时间
  checkInDate: string // 入伙时间
  contractBegin: string // 物业合同生效日期
  contractEnd: string // 物业合同终止日期
  propertyCompany: string // 物业公司名称
  warrantyContractBegin: string // 质保合同生效日期
  warrantyContractEnd: string // 质保合同终止日期
  totalHouseholds: number // 总户数
  groundParkingSpace: number // 地上车位数量
  undergroundParkingSpace: number // 地下车位数量
  machineryParkingSpace: number // 机械车位数量
  parkingSpaceRatio: string // 车位配比
  staffEntrance: number // 人行出入口数量
  carEntrance: number // 车辆出入口数量
  customElevator: number // 客梯数量
  goodsElevator: number // 货梯数量
  firefightElevator: number // 消防梯数量
  propertyFeeModel: string // 物业费收费模式
  roomStandard: string // 住宅物业收费标准
  shopStandard: string // 底商物业收费标准
  independentShopStandard: string // 独立商业物业收费标准
  groundParkingStandard: string // 地上车位收费标准
  undergroundParkingStandard: string // 地下车位收费标准
  buildingCount: number // 楼栋数
  residentialRoomCount: number // 住宅房间数
  commercialRoomCount: number // 商业房间数
  parkingLotCount: number // 停车场数
  parkingSpaceCount: number // 停车位数
  floorCount: number // 楼层数
  enclosureCount: number // 围合数（暂为0，来源待确认）
  spacePointCount: number // 空间点位数
}

// 物业-项目装修协议配置保存DTO
interface PmsProjectConfigRenovationDTO {
  pmsProjectId: string // PMS项目ID
  renovationCompanyTemplateId?: string // 装修协议模板ID(装修公司)
  renovationResidentTemplateId?: string // 装修协议模板ID(住户)
  renovationPrecondition?: string // 签署前置条件（文本描述，如"需提交装修押金收据"）
}

// 物业-项目财务配置保存DTO
interface PmsProjectConfigFinanceDTO {
  pmsProjectId: string // PMS项目ID
  financeTemplateId?: string // 财务配置模板ID
  bankAccountIds?: string // 银行转账收款账户ID(JSON数组)
  onlinePaymentMerchantIds?: string // 在线支付收款商户ID(JSON数组)
  onlineCollectionAccountId?: string // 线上托收收款账户ID
  offlineCollectionAccountId?: string // 线下托收收款账户ID
  cbsIntegrationAccountId?: string // CBS集成账户ID
  externalCollectionAccountId?: string // 系统外托收账户ID
  posPaymentAccountId?: string // POS支付收款账户ID
  financeShareProjectName?: string // 财务共享项目名称
  financeShareProjectCode?: string // 财务共享项目编码
  financeAutoPush?: boolean // 是否自动推送财务共享
  financeShareScope?: boolean // 是否属于财务共享范围
}

// 按房屋面积计费-单价配置
interface AreaPriceConfigDTO {
  mode: string // 子模式: fixed_unit_price(固定单价) / first_year_special(首年特惠)
  unitPrice: number // 固定单价模式-单价(元/㎡/月)
  specialStartDate: string // 首年特惠模式-优惠期开始日期
  specialEndDate: string // 首年特惠模式-优惠期结束日期
  specialUnitPrice: number // 首年特惠模式-优惠单价(元/㎡/月)
  standardUnitPrice: number // 首年特惠模式-到期后标准单价(元/㎡/月)
}

// 物业-项目基本配置保存DTO
interface PmsProjectConfigBasicDTO {
  pmsProjectId: string // PMS项目ID
  residentialFeeMode?: string // 住宅物业费模式: fixed/area
  residentialFeeValue?: number // 住宅物业费值（fixed模式用）
  residentialAreaPriceConfig?: AreaPriceConfigDTO // 住宅按面积计费单价配置（area模式用）
  commercialFeeMode?: string // 商业物业费模式: fixed/area
  commercialFeeValue?: number // 商业物业费值（fixed模式用）
  commercialAreaPriceConfig?: AreaPriceConfigDTO // 商业按面积计费单价配置（area模式用）
  billingStartType?: string // 账单周期开始日类型: check_in_date/lease_start_date/fixed/advance_days
  billingFixedDay?: number // 固定号数(1-28)，billingStartType=fixed时必填
  billingStartAdvanceDays?: number // 提前N天起算，billingStartType=advance_days时必填（正整数）
  paymentAdvanceDays?: number // 收款日提前天数
  billingDisplayMode?: string // 账单展示方式: full/advance_days
  billingAdvanceDays?: number // 提前N天展示
  lateFeeEnabled?: boolean // 是否收取滞纳金
  lateFeeMethod?: string // 滞纳金计算方式: simple_interest/compound_interest
  accessCardDeposit?: number // 出入证押金
  accessCardDepositEditable?: boolean // 出入证押金-入伙登记时可修改
  doorCardDeposit?: number // 门禁卡押金
  doorCardDepositEditable?: boolean // 门禁卡押金-入伙登记时可修改
  renovationDepositResidential?: number // 装修押金(住宅)
  renovationDepositResidentialEditable?: boolean // 装修押金(住宅)-装修许可证申请时可修改
  renovationDepositCommercial?: number // 装修押金(商业)
  renovationDepositCommercialEditable?: boolean // 装修押金(商业)-装修许可证申请时可修改
  maintenanceFundRate?: number // 专项维修基金(元/㎡/月)
  maintenanceFundRateEditable?: boolean // 专项维修基金-入伙登记时可修改
  waterFeeMode?: string // 水费模式: fixed_price/tiered_price
  waterFeePrice?: number // 水费固定单价
  waterTieredPrices?: UtilityFeeTierDTO[] // 水费阶梯单价列表
  sewageFee?: number // 污水处理费
  electricFeeMode?: string // 电费模式: fixed_price/tiered_price
  electricFeePrice?: number // 电费固定单价
  electricTieredPrices?: UtilityFeeTierDTO[] // 电费阶梯单价列表
  leaseTemplateId?: string // 物业协议模板ID(租赁)
  commercialTemplateId?: string // 物业协议模板ID(商业)
  ownerTemplateId?: string // 物业协议模板ID(业主)
  publicTemplateId?: string // 物业协议模板ID(公配)
  signingEntity?: string // 签约主体
  vacancyDiscountTiers?: VacancyDiscountTierDTO[] // 空置房折扣分档配置列表
  prepareDateBegin?: string // 竣备时间-开始
  prepareDateEnd?: string // 竣备时间-结束
  mergeFirstMonth?: boolean // 合并零头首月
  mergeLastMonth?: boolean // 合并零头尾月
  coverImage?: string // 封面照片URL
}

// 水/电费阶梯单价
interface UtilityFeeTierDTO {
  start: number // 用量区间起始值
  end: number // 用量区间结束值
  price: number // 单价
}

// 空置房折扣分档
interface VacancyDiscountTierDTO {
  minOccupancyRate: number // 出租率区间下限(%)
  maxOccupancyRate: number // 出租率区间上限(%)
  discountRate: number // 折扣比例(0-100)
}

// 物业-项目配置查询DTO
interface PmsProjectConfigQueryDTO {
  pmsProjectId: string // PMS项目ID
}

// 按房屋面积计费-单价配置
interface AreaPriceConfigVO {
  mode: string // 子模式: fixed_unit_price(固定单价) / first_year_special(首年特惠)
  unitPrice: number // 固定单价模式-单价(元/㎡/月)
  specialStartDate: string // 首年特惠模式-优惠期开始日期
  specialEndDate: string // 首年特惠模式-优惠期结束日期
  specialUnitPrice: number // 首年特惠模式-优惠单价(元/㎡/月)
  standardUnitPrice: number // 首年特惠模式-到期后标准单价(元/㎡/月)
}

// 物业-项目配置VO
interface PmsProjectConfigVO {
  id: string // 配置ID
  pmsProjectId: string // PMS项目ID
  residentialFeeMode: string
  residentialFeeValue: number
  residentialAreaPriceConfig: AreaPriceConfigVO
  commercialFeeMode: string
  commercialFeeValue: number
  commercialAreaPriceConfig: AreaPriceConfigVO
  billingStartType: string
  billingFixedDay: number
  billingStartAdvanceDays: number
  paymentAdvanceDays: number
  billingDisplayMode: string
  billingAdvanceDays: number
  lateFeeEnabled: boolean
  lateFeeMethod: string
  accessCardDeposit: number
  accessCardDepositEditable: boolean
  doorCardDeposit: number
  doorCardDepositEditable: boolean
  renovationDepositResidential: number
  renovationDepositResidentialEditable: boolean
  renovationDepositCommercial: number
  renovationDepositCommercialEditable: boolean
  maintenanceFundRate: number
  maintenanceFundRateEditable: boolean
  waterFeeMode: string
  waterFeePrice: number
  waterTieredPrices: UtilityFeeTierVO[]
  sewageFee: number
  electricFeeMode: string
  electricFeePrice: number
  electricTieredPrices: UtilityFeeTierVO[]
  leaseTemplateId: string
  commercialTemplateId: string
  ownerTemplateId: string
  publicTemplateId: string
  signingEntity: string
  vacancyDiscountTiers: VacancyDiscountTierVO[]
  prepareDateBegin: string
  prepareDateEnd: string
  mergeFirstMonth: boolean
  mergeLastMonth: boolean
  coverImage: string
  financeTemplateId: string
  bankAccountIds: string
  onlinePaymentMerchantIds: string
  onlineCollectionAccountId: string
  offlineCollectionAccountId: string
  cbsIntegrationAccountId: string
  externalCollectionAccountId: string
  posPaymentAccountId: string
  financeShareProjectName: string
  financeShareProjectCode: string
  financeAutoPush: boolean
  financeShareScope: boolean
  renovationCompanyTemplateId: string
  renovationResidentTemplateId: string
  renovationPrecondition: string
}

// 水/电费阶梯单价
interface UtilityFeeTierVO {
  start: number // 用量区间起始值
  end: number // 用量区间结束值
  price: number // 单价
}

// 空置房折扣分档
interface VacancyDiscountTierVO {
  minOccupancyRate: number // 出租率区间下限(%)
  maxOccupancyRate: number // 出租率区间上限(%)
  discountRate: number // 折扣比例(0-100)
}

// 更新移交文件状态DTO
interface PmsHandoverItemUpdateDTO {
  id: string // 文件项ID
  transferred: boolean // 是否已移交
  attachments?: string[] // 附件URL列表（可选）
}

// 查验移交/遗留问题列表查询DTO
interface PmsHandoverListDTO {
  projectId: string // PMS项目ID
}

// 物业-查验移交文件项VO
interface PmsHandoverItemVO {
  id: string // 文件项ID
  category: string // 分类编码: approval/planning/construction/other/handover_list
  categoryName: string // 分类名称
  itemName: string // 文件项名称
  transferred: boolean // 是否已移交
  attachments: string[] // 附件URL列表
  sortOrder: number // 排序号
}

// 编辑遗留问题DTO
interface PmsLegacyIssueUpdateDTO {
  id: string // 问题ID
  description: string // 问题描述
}

// 物业-遗留问题VO
interface PmsLegacyIssueVO {
  id: string // 问题ID
  description: string // 问题描述
  insertTime: string // 创建时间
}

// 新增遗留问题DTO
interface PmsLegacyIssueInsertDTO {
  projectId: string // PMS项目ID
  description: string // 问题描述
}

// 通用ID查询/操作DTO
interface IdDTO {
  id: string // ID
}

interface PmsEmployeeUpdateExtDTO {
  userId: string // 员工用户ID（auth_user.user_id）
  employeeGroups?: string[] // 员工组别列表（SysDic PMS_EMPLOYEE_GROUP 的 dic_code 值，多选）
  notes?: string // 备注
}

interface PmsEmployeeVO {
  id: string // 用户ID（auth_user.user_id，只读）
  employeeName: string // 姓名（只读，来自 auth_user.nick_name）
  mobile: string // 手机号（只读，来自 auth_user.mobile）
  employeeNumber: string // 工号（只读，来自 auth_user.employee_number）
  avatarFid: string // 头像文件ID（只读，来自 auth_user.avatar_fid）
  departmentId: string // 所属部门ID
  departmentName: string // 所属部门名称
  roleNames: string[] // 当前角色名称列表
  employeeGroup: string[] // 员工组别码值列表（物业侧扩展，SysDic PMS_EMPLOYEE_GROUP dic_code，多值）
  employeeGroupName: string[] // 员工组别名称列表（SysDic 转换）
  notes: string // 备注（物业侧扩展）
}

interface PmsEmployeeListDTO {
  pageable: boolean
  pageNum: number
  pageSize: number
  exportFields: string[]
  employeeGroups: string[] // 员工组别筛选（数组，SysDic PMS_EMPLOYEE_GROUP 值，支持多选）
  searchName: string // 关键字搜索（按姓名模糊匹配）
}

interface SysDicSortDTO {
  dicId: string // 字典ID
  dicSort: number // 排序值（越小越靠前）
}

interface PmsCustomerVehicleInsertDTO {
  customerId: string // 客户ID（必填）
  plateNo?: string // 车牌号
  carType?: string // 车型
  parkingNo?: string // 车位号
}

interface PmsCustomerUpdateDTO {
  id: string // 客户ID（必填）
  customerName?: string // 客户姓名
  certType?: string // 证件类型（SYS_CERT_TYPE字典）
  certNo?: string // 证件号（更新时重新加密）
  gender?: string // 性别（SYS_GENDER字典）
  birthday?: string // 出生日期
  certPhoto?: string // 证件照片（多张，JSON数组存URL）
  bankAccount?: string // 银行账号
  bankCardPhoto?: string // 银行卡照片（多张，JSON数组存URL）
  personalPhoto?: string // 个人照片（单张URL）
  remark?: string // 备注
}

interface PmsCustomerListDTO {
  pageable: boolean
  pageNum: number
  pageSize: number
  exportFields: string[] // 导出字段列表
  customerName: string // 客户姓名（模糊搜索）
  phone: string // 手机号（精确搜索）
  dataSource: string // 数据来源: ADMIN/RENTAL/APP
  startTime: string // 创建开始时间
  endTime: string // 创建结束时间
}

interface PmsCustomerVO {
  id: string // 客户ID
  customerName: string // 客户姓名
  phone: string // 手机号（脱敏，格式: 138****8888）
  certType: string // 证件类型
  certNo: string // 证件号（脱敏，格式: 12321321****）
  gender: string // 性别
  dataSource: string // 数据来源: ADMIN/RENTAL/APP
  insertTime: string // 创建时间
  remark: string // 备注
}

interface PmsCustomerInsertDTO {
  customerName: string // 客户姓名
  phone: string // 手机号（必填，唯一键）
  certType?: string // 证件类型（SYS_CERT_TYPE字典）
  certNo?: string // 证件号
  gender?: string // 性别（SYS_GENDER字典）
  birthday?: string // 出生日期
  certPhoto?: string // 证件照片（多张，JSON数组存URL）
  bankAccount?: string // 银行账号
  bankCardPhoto?: string // 银行卡照片（多张，JSON数组存URL）
  personalPhoto?: string // 个人照片（单张URL）
  remark?: string // 备注
}

interface PmsCustomerDetailVO {
  id: string // 客户ID
  customerName: string // 客户姓名
  phone: string // 手机号（明文）
  certType: string // 证件类型
  certNo: string // 证件号（明文）
  gender: string // 性别
  birthday: string // 出生日期
  dataSource: string // 数据来源: ADMIN/RENTAL/APP
  certPhoto: string // 证件照片（多张，JSON数组存URL）
  bankAccount: string // 银行账号
  bankCardPhoto: string // 银行卡照片（多张，JSON数组存URL）
  personalPhoto: string // 个人照片（单张URL）
  remark: string // 备注
  insertTime: string // 创建时间
  vehicleList: PmsCustomerVehicleVO[] // 车辆信息列表
}

interface PmsCustomerVehicleVO {
  id: string // 车辆ID
  customerId: string // 客户ID
  plateNo: string // 车牌号
  carType: string // 车型
  parkingNo: string // 车位号
}
