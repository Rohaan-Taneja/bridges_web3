import { MigrationInterface, QueryRunner } from "typeorm";

export class UserAccountAddress1748609365509 implements MigrationInterface {
    name = 'UserAccountAddress1748609365509'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_account_address" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "amount_deposited" integer, "userId" integer NOT NULL, CONSTRAINT "REL_d5865fa9fe2b358f64f2cac2ff" UNIQUE ("userId"), CONSTRAINT "PK_e0f2745cc7960d004a13c6dd9b8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_account_address" ADD CONSTRAINT "FK_d5865fa9fe2b358f64f2cac2ff8" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_account_address" DROP CONSTRAINT "FK_d5865fa9fe2b358f64f2cac2ff8"`);
        await queryRunner.query(`DROP TABLE "user_account_address"`);
    }

}
