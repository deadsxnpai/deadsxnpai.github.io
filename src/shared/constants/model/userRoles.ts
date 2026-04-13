export const enum UserRoles {
  // ==================================================
  // Основные роли пользователей
  // ==================================================
  TESTER = 'tester',
  STUDENT = 'student',
  STUDENT_RAKUS = 'student-rakus',
  EMPLOYEE = 'employee',
  TEACHER = 'teacher',
  TEACHER_GPH = 'teacherGPH',
  WORKER = 'worker',
  SELFSIGNUP = 'selfsignup',
  UNKNOWN = 'unknown',

  // ==================================================
  // Эффективный контракт
  // ==================================================
  DIRECTOR_INSTITUTE = 'director-Institute',
  DIRECTOR_FACULTY = 'director-faculty',
  URVO_ADMIN = 'urvo-admin',
  EC_UMO_MODER = 'ec-moder-umo',
  EC_UKS_MODER = 'ec-moder-uks',
  EC_MODER_VO210 = 'ec-moder-vo210',
  EC_MODER_SCIENCE_VO = 'ec-moder-science-vo',
  EC_MODER_NIRS = 'ec-moder-nirs',
  EC_MODER_PROJECTS = 'ec-moder-projects',
  EC_MODER_STRATEGIC = 'ec-moder-strategic',
  EC_MODER_DPO = 'ec-moder-dpo',
  // ==================================================
  // Модераторские роли (по функциональным областям)
  // ==================================================
  PA_MODER = 'pa_moder',
  OSRV_MODER = 'osrv-moder',
  URTOS_MODER = 'urtos-moder',
  PORTFOLIO_MFC_MODER = 'portfolio-mfc-moder',
  PORTFOLIO_KURATOR = 'portfolio-kurator',
  AUP_CK_MODER = 'aup-ck-moder',
  MAJORS_MODERATOR = 'TMB/tmb-lk-moderator-major',

  // ==================================================
  // Роли для работы с уведомлениями
  // ==================================================
  NOTIFICATION_MODER = 'notification-moder',
  NOTIFICATION_ADMIN = 'notification-admin',

  // ==================================================
  // Специальные права доступа
  // ==================================================
  PROSMOTR_MOE_OBUCHENIE = 'prosmotr-moe-obuchenie',
}
