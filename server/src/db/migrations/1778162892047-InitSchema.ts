import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1778162892047 implements MigrationInterface {
    name = 'InitSchema1778162892047'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "events" ADD "color" character varying(7)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "color"`);
    }

}
