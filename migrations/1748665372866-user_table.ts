import { MigrationInterface, QueryRunner } from "typeorm";

export class UserTable1748665372866 implements MigrationInterface {
    name = 'UserTable1748665372866'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_account_address" DROP CONSTRAINT "FK_d5865fa9fe2b358f64f2cac2ff8"`);
        await queryRunner.query(`ALTER TABLE "user_account_address" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_account_address" ADD CONSTRAINT "FK_d5865fa9fe2b358f64f2cac2ff8" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_account_address" DROP CONSTRAINT "FK_d5865fa9fe2b358f64f2cac2ff8"`);
        await queryRunner.query(`ALTER TABLE "user_account_address" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_account_address" ADD CONSTRAINT "FK_d5865fa9fe2b358f64f2cac2ff8" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
