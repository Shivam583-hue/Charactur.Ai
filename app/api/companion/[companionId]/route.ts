import prismadb from "@/lib/prismadb"
import { currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function PATCH(req: Request, { params }: { params: { companionId: string } }) {
  try {
    const body = await req.json()
    const user = await currentUser()
    const { src, name, description, categoryId, instructions, seed } = body


    if (!user || !user.id || !user.firstName) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    if (!params.companionId) {
      return new NextResponse("Missing companionId", { status: 400 })
    }

    if (!src || !name || !description || !categoryId || !instructions || !seed) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    //TODO: Check for subscription

    const companion = await prismadb.companion.update({
      where: {
        id: params.companionId
      },
      data: {
        userId: user.id,
        userName: user.firstName,
        src,
        name,
        description,
        instructions,
        seed,
        category: {
          connect: { id: categoryId }
        }
      },
    })

    return NextResponse.json(companion)

  } catch (error) {
    console.log("#2", error)
    console.error(error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
