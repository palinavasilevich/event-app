import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1777554982623 implements MigrationInterface {
    name = 'InitSchema1777554982623'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "events" RENAME COLUMN "createAt" TO "createdAt"`);
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "createAt" TO "createdAt"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "createdAt" TO "createAt"`);
        await queryRunner.query(`ALTER TABLE "events" RENAME COLUMN "createdAt" TO "createAt"`);
    }

}
