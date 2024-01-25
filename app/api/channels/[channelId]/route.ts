import { NextResponse } from "next/server";
import { MemberRole } from "@prisma/client";
// @ts-ignore
import { currentProfile } from "@/lib/current-profile";
// @ts-ignore
import { db } from "@/lib/db";

export async function DELETE(req: Request, { params }: { params: { channelId: string } }) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");

    if (!profile) return new NextResponse("Unauthorized", { status: 401 });
    if (!serverId) return new NextResponse("Server ID Missing", { status: 400 });
    if (!params.channelId) return new NextResponse("Channel ID Missing", { status: 400 });

    const server = await db.server.update({
      where: {
        id: serverId,
        members: { some: { profileId: profile.id, role: { in: [MemberRole.ADMIN, MemberRole.MODERATOR] } } },
      },
      data: { channels: { delete: { id: params.channelId, name: { not: "general" } } } },
    });

    return NextResponse.json(server);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { channelId: string } }) {
  try {
    const profile = await currentProfile();
    // @ts-ignore
    const { name, type } = await req.json();
    console.log(name, type);
    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");

    if (!profile) return new NextResponse("Unauthorized", { status: 401 });
    if (!serverId) return new NextResponse("Server ID Missing", { status: 400 });
    if (!params.channelId) return new NextResponse("Channel ID Missing", { status: 400 });
    if (name === "general") return new NextResponse("Channel name cannot be 'general'", { status: 400 });

    const server = await db.server.update({
      where: {
        id: serverId,
        members: { some: { profileId: profile.id, role: { in: [MemberRole.ADMIN, MemberRole.MODERATOR] } } },
      },
      data: { channels: { delete: { id: params.channelId, name: { not: "general" } } } },
    });

    return NextResponse.json(server);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
