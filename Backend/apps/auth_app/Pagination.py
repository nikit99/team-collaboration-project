# utils/pagination.py
from rest_framework.pagination import PageNumberPagination

class OptionalPageNumberPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100
    
    def paginate_queryset(self, queryset, request, view=None):
        if 'no_page' in request.query_params:
            return None
        return super().paginate_queryset(queryset, request, view)