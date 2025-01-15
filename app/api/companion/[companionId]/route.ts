import prismadb from "@/lib/prismadb"
import { auth, currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function PATCH(req: Request, { params }: { params: Promise<{ companionId: string }> }) {
  try {
    const body = await req.json()
    const user = await currentUser()
    const { src, name, description, categoryId, instructions, seed } = body


    if (!user || !user.id || !user.firstName) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    if (!(await params).companionId) {
      return new NextResponse("Missing companionId", { status: 400 })
    }

    if (!src || !name || !description || !categoryId || !instructions || !seed) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    //TODO: Check for subscription

    const companion = await prismadb.companion.update({
      where: {
        userId: user.id,
        id: (await params).companionId
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


export async function DELETE(req: Request, { params }: { params: Promise<{ companionId: string }> }) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const companion = await prismadb.companion.delete({
      where: {
        id: (await params).companionId,
        userId
      }
    })

    return NextResponse.json(companion)

  } catch (error) {
    console.log("#3", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
