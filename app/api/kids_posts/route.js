import { db } from "@/utils";
import {
  KIDS_POSTS,
  KIDS_COMMUNITY,
  USER_DETAILS,
  CHILDREN,
  KIDS_LIKES,
  KIDS_COMMENTS,
} from "@/utils/schema";
import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { authenticate } from "@/lib/jwtMiddleware";

export async function POST(req) {
  const authResult = await authenticate(req);

  if (!authResult.authenticated) {
    return authResult.response;
  }

  const userId = authResult.decoded_Data.id;
  const { age } = await req.json();

  let finalAge = age;

  if (!age) {
    const firstChild = await db
      .select()
      .from(CHILDREN)
      .where(eq(CHILDREN.user_id, userId))
      .limit(1)
      .execute();

    if (firstChild.length > 0) {
      finalAge = firstChild[0].age;
    } else {
      return NextResponse.json(
        { error: "No children found for the user." },
        { status: 404 }
      );
    }
  }

  const existing_kids_community = await db
    .select()
    .from(KIDS_COMMUNITY)
    .where(eq(KIDS_COMMUNITY.age, finalAge))
    .execute();

  let community_id = null;
  if (existing_kids_community.length > 0) {
    community_id = existing_kids_community[0].id;
  } else {
    return NextResponse.json(
      { message: "Community not found for the given age." },
      { status: 404 }
    );
  }

  try {
    const postsWithUserAndChild = await db
      .select({
        postId: KIDS_POSTS.id,
        content: KIDS_POSTS.content,
        caption: KIDS_POSTS.caption,
        createdAt: KIDS_POSTS.created_at,
        username: USER_DETAILS.name,
        post_type: KIDS_POSTS.post_type,
        slug: KIDS_POSTS.slug,
        childname: CHILDREN.name,
      })
      .from(KIDS_POSTS)
      .leftJoin(USER_DETAILS, eq(KIDS_POSTS.user_id, USER_DETAILS.id))
      .leftJoin(CHILDREN, eq(KIDS_POSTS.child_id, CHILDREN.id))
      .where(eq(KIDS_POSTS.community_id, community_id))
      .execute();

    const postsWithLikesAndComments = await Promise.all(
      postsWithUserAndChild.map(async (post) => {
        const [like] = await db
          .select()
          .from(KIDS_LIKES)
          .where(
            and(
              eq(KIDS_LIKES.post_id, post.postId),
              eq(KIDS_LIKES.user_id, userId)
            )
          )
          .execute();

        return {
          ...post,
          likedByUser: like ? true : false,
        };
      })
    );

    return NextResponse.json({ data: postsWithLikesAndComments });
  } catch (error) {
    console.error("Fetch Posts Error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
