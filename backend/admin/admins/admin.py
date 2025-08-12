from django.contrib import admin
from .models import User_details, Page, PagePermission, Comment, CommentHistory

admin.site.register(User_details)
admin.site.register(Page)
admin.site.register(PagePermission)
admin.site.register(Comment)
admin.site.register(CommentHistory)



