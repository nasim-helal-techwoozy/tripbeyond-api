-- AlterTable
CREATE SEQUENCE agents_agentid_seq;
ALTER TABLE "agents" ALTER COLUMN "agentID" SET DEFAULT nextval('agents_agentid_seq');
ALTER SEQUENCE agents_agentid_seq OWNED BY "agents"."agentID";
