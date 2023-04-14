<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\models\Blogs;

class BlogController extends Controller
{
    public function createBlogPost(Request $request) {
        \Log::info($request);
        try {
            $newBlog = new Blogs;
            $newBlog->title = $request->blog["title"];
            $newBlog->content = $request->blog["data"];
            $newBlog->userEmail = $request->blog["email"];
            $newBlog->save();
            return "success";
        } catch (Exception $e) {
            \Log::error("could not create blog post");
            return "failure";
        }
    }

    public function getBlogs(Request $request) {
        \Log::info($request);
        try {
            $blogData = Blogs::where('userEmail', '=', $request->email)->get()->toArray();
            \Log::info($blogData[0]);
            \Log::info($blogData[0]["userEmail"]);
            return $blogData;
        } catch (Exception $e) {
            \Log::error("could not retrieve blog post");
            return "failure";
        }
    }

    public function deleteBlog(Request $request, $id) {
        \Log::info($request);
        try {
            \Log::info($request);
            \Log::info($id);
            Blogs::where('id', '=', $id)->delete();
            return "success";
        } catch (Exception $e) {
            \Log::error("could not delete blog post");
            return "failure";
        }
    }

    public function editBlog(Request $request, $id) {
        \Log::info($request);
        try {
            \Log::info($request['newBlog']);
            \Log::info($id);
            $test = Blogs::where('id', '=', $id)->update(['content' => $request['newBlog']]);
            return "success";
        } catch (Exception $e) {
            \Log::error("could not edit blog post");
            return "failure";
        }
    }
}
