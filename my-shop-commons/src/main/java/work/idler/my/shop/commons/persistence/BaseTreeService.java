package work.idler.my.shop.commons.persistence;

import work.idler.my.shop.commons.dto.BaseResult;

import java.util.List;

/**
 * 通用树形结构业务逻辑层
 * @Auther:http://blog.idler.work
 * @Date:2019/4/14
 * @Description:work.idler.my.shop.commons.persistence
 * @version:1.0
 */
public interface BaseTreeService<T extends BaseEntity> {
    /**
     * 查询全部
     * @return
     */
    public List<T> selectAll();

    /**
     * 新增
     * @param entity
     */
    BaseResult save(T entity);

    /**
     * 更新
     * @param entity
     */
    void update(T entity);

    /**
     * 根据 id 查询
     * @param id
     * @return
     */
    T getById(Long id);

    /**
     * 根据 id 删除
     * @param id
     */
    void delete(Long id);

    /**
     * 根据父级节点 ID 查询所有子节点
     * @param pid
     * @return
     */
    List<T> selectByPid(Long pid);
}
