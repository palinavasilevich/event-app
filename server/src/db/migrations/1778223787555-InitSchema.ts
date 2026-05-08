import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1778223787555 implements MigrationInterface {
    name = 'InitSchema1778223787555'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_favorite_events" ("usersId" uuid NOT NULL, "eventsId" uuid NOT NULL, CONSTRAINT "PK_c05013cd99eb2471bf1cfc779c9" PRIMARY KEY ("usersId", "eventsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_465f51c2edc318c3cc9919ec9a" ON "user_favorite_events" ("usersId") `);
        await queryRunner.query(`CREATE INDEX "IDX_3bce1c02dd62cca51742fb6096" ON "user_favorite_events" ("eventsId") `);
        await queryRunner.query(`ALTER TABLE "user_favorite_events" ADD CONSTRAINT "FK_465f51c2edc318c3cc9919ec9aa" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_favorite_events" ADD CONSTRAINT "FK_3bce1c02dd62cca51742fb60960" FOREIGN KEY ("eventsId") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_favorite_events" DROP CONSTRAINT "FK_3bce1c02dd62cca51742fb60960"`);
        await queryRunner.query(`ALTER TABLE "user_favorite_events" DROP CONSTRAINT "FK_465f51c2edc318c3cc9919ec9aa"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3bce1c02dd62cca51742fb6096"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_465f51c2edc318c3cc9919ec9a"`);
        await queryRunner.query(`DROP TABLE "user_favorite_events"`);
    }

}
