<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

abstract class BaseApiController extends Controller {

    const MAX_PAGINATION = 100;

    public function getPerPage(Request $request) {
        $perPage = $request->input('per_page', self::MAX_PAGINATION);
        return min($perPage, self::MAX_PAGINATION);
    }
}
