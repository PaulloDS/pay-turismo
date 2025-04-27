/**
 * @swagger
 * components:
 *   schemas:
 *     Agency:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID único da agência
 *         fantasyName:
 *           type: string
 *           description: Nome fantasia da agência
 *         legalName:
 *           type: string
 *           description: Razão social da agência
 *         cnpj:
 *           type: string
 *           description: CNPJ da agência
 *         stateRegistration:
 *           type: string
 *           description: Inscrição estadual da agência
 *         foundingDate:
 *           type: string
 *           format: date
 *           description: Data de fundação da agência
 *         status:
 *           type: string
 *           enum: [ACTIVE, INACTIVE, PENDING, SUSPENDED]
 *           description: Status atual da agência
 *         email:
 *           type: string
 *           format: email
 *           description: Email de contato da agência
 *         phone:
 *           type: string
 *           description: Telefone de contato da agência
 *         address:
 *           type: string
 *           description: Endereço da agência
 *         city:
 *           type: string
 *           description: Cidade da agência
 *         state:
 *           type: string
 *           description: Estado da agência
 *         website:
 *           type: string
 *           nullable: true
 *           description: Website da agência (opcional)
 *         description:
 *           type: string
 *           nullable: true
 *           description: Descrição da agência (opcional)
 *         createdBy:
 *           type: string
 *           description: ID do usuário que criou a agência
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Data e hora de criação do registro
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Data e hora da última atualização
 *       required:
 *         - fantasyName
 *         - legalName
 *         - cnpj
 *         - stateRegistration
 *         - foundingDate
 *         - status
 *         - email
 *         - phone
 *         - address
 *         - city
 *         - state
 *
 *     AgencyInput:
 *       type: object
 *       properties:
 *         fantasyName:
 *           type: string
 *           description: Nome fantasia da agência
 *         legalName:
 *           type: string
 *           description: Razão social da agência
 *         cnpj:
 *           type: string
 *           description: CNPJ da agência
 *         stateRegistration:
 *           type: string
 *           description: Inscrição estadual da agência
 *         foundingDate:
 *           type: string
 *           format: date
 *           description: Data de fundação da agência
 *         status:
 *           type: string
 *           enum: [ACTIVE, INACTIVE, PENDING, SUSPENDED]
 *           description: Status atual da agência
 *         email:
 *           type: string
 *           format: email
 *           description: Email de contato da agência
 *         phone:
 *           type: string
 *           description: Telefone de contato da agência
 *         address:
 *           type: string
 *           description: Endereço da agência
 *         city:
 *           type: string
 *           description: Cidade da agência
 *         state:
 *           type: string
 *           description: Estado da agência
 *         website:
 *           type: string
 *           nullable: true
 *           description: Website da agência (opcional)
 *         description:
 *           type: string
 *           nullable: true
 *           description: Descrição da agência (opcional)
 *       required:
 *         - fantasyName
 *         - legalName
 *         - cnpj
 *         - stateRegistration
 *         - foundingDate
 *         - status
 *         - email
 *         - phone
 *         - address
 *         - city
 *         - state
 *
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID único do usuário
 *         email:
 *           type: string
 *           format: email
 *           description: Email do usuário
 *         role:
 *           type: string
 *           enum: [ADMIN, ANALYST]
 *           description: Função do usuário
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Data e hora de criação do registro
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Data e hora da última atualização
 */

// Este arquivo é apenas para documentação do Swagger e não contém código executável
export {};
