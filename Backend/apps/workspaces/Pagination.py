# apps/workspaces/pagination.py
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

class WorkspacePagination(PageNumberPagination):
    page_size = 10  # Default page size
    page_size_query_param = 'page_size'  # Allow client to override
    max_page_size = 100  # Maximum limit
    
    def get_paginated_response(self, data):
        return Response({
            'count': self.page.paginator.count,
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'current_page': self.page.number,
            'total_pages': self.page.paginator.num_pages,
            'results': data
        })