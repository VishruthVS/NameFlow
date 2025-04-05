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

if (!process.env.NEXT_PUBLIC_APP_ID || !process.env.NEXT_PUBLIC_ACTION_ID) {
  throw new Error('Environment variables NEXT_PUBLIC_APP_ID and NEXT_PUBLIC_ACTION_ID must be set');
}

export async function POST(req: Request) {
  try {
    const appId = process.env.NEXT_PUBLIC_APP_ID;
    const actionId = process.env.NEXT_PUBLIC_ACTION_ID;
    
    if (!appId?.startsWith('app_') || !actionId) {
      throw new Error('Invalid or missing APP_ID or ACTION_ID');
    }

    const body = await req.json();
    console.log("Backend received body:", body);
    
    const verifyRes = await verifyCloudProof(
      body.proof, 
      appId as `app_${string}`,
      actionId, 
      body.signal
    );
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