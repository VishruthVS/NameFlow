import { VerificationLevel } from "@worldcoin/idkit";
import { verifyCloudProof } from "@worldcoin/idkit-core/backend";

export type VerifyReply = {
  success: boolean;
  code?: string;
  attribute?: string | null;
  detail?: string;
};

interface IVerifyRequest {
  proof: {
    nullifier_hash: string;
    merkle_root: string;
    proof: string;
    verification_level: VerificationLevel.Device;
  };
  signal?: string;
}

const app_id = "app_f0ef697d1647ae52695abb0c2ca3407c";
const action = "test-app";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Backend received body:", body);
    
    const verifyRes = await verifyCloudProof(body.proof, app_id, action, body.signal);
    console.log("Backend verification response:", verifyRes);

    if (verifyRes.success) {
      return Response.json({ success: true });
    } else {
      return Response.json({ 
        success: false, 
        code: verifyRes.code, 
        attribute: verifyRes.attribute, 
        detail: verifyRes.detail 
      });
    }
  } catch (error) {
    console.error("Backend error:", error);
    return Response.json(
      { success: false, detail: error instanceof Error ? error.message : "Verification failed" },
      { status: 500 }
    );
  }
} 